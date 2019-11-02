const express = require("express");
const app = express();
const admin = require("./fbadmin");
const bearerToken = require('express-bearer-token');
const bodyParser = require("body-parser");
const loginService = require("./loginService");
const modelValidator = require("./userModelValidator");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
var TOKEN_KEY = process.env.TOKEN_KEY;

app.use(bodyParser.json());

//return api reference
app.get("/", function (req, res) {
  res.send(
    "post: /token, body: {email, password}, return: {fbToken, accessToken}, fail: 401\n" +
    "post: /verifyAccessToken, headers[authorization]: bearer + accessToken, return: decodedAccessToken, fail: 401"
  );
});

app.post("/token", function (req, res) {
  //validate model
  var email = req.body.email;
  var password = req.body.password;
  var error = modelValidator(email, password);
  if (error) {
    return res.status(error.statusCode).send(error.message);
  }
  //validate user credentials and return firebase token
  var resJson = {};
  loginService
    .getToken(email, password)
    .then(token => {
      var jToken = jwt.sign(
        {
          uid: token.UserGUID,
          UserFirstName: token.UserFirstName,
          UserLastName: token.UserLastName
        },
        TOKEN_KEY,
        { expiresIn: "1h" }
      );
      resJson.accessToken = jToken;
      admin
        .auth()
        .getUser(token.UserGUID)
        .then(function (userRecord) {
          console.log(userRecord);
          admin
            .auth()
            .createCustomToken(userRecord.uid)
            .then(function (customToken) {
              resJson.fbToken = customToken;
              res.send(resJson);
            })
            .catch(function (err) {
              console.log("Error creating custom token:" + err);
              res.status(500).send("Error creating custom token");
            });
        })
        .catch(function (err) {
          //either user does not exist or server can not connect to firebase
          console.log("Error fetching user data:", err);
          //create firebase user
          admin
            .auth()
            .createUser({
              uid: token.UserGUID,
              email: email,
              emailVerified: true,
              displayName: `${token.UserFirstName} ${token.UserLastName}`,
              disabled: false
            })
            .then(function (userRecord) {
              admin
                .auth()
                .createCustomToken(userRecord.uid)
                .then(function (customToken) {
                  resJson.fbToken = customToken;
                  res.send(resJson);
                })
                .catch(function (err) {
                  console.log("Error creating custom token:" + err);
                  res.status(500).send("Error creating custom token");
                });
            })
            .catch(function (err) {
              console.log("Error creating new firebase user", err);
              res.status(500).send("Error creating new firebase user");
            });
        });
    })
    .catch(function (err) {
      if (!err.custom) {
        console.log("Unknown error", err);
        err.statusCode = 500;
        err.message = "Unknown Error";
      }
      console.log(err.error || "");
      return res.status(err.statusCode).send(err.message);
    });
});

app.use(bearerToken());
app.post("/verifyAccessToken", function (req, res) {
  var accessToken = req.token;
  if (!accessToken) {
    return res.status(401).send();
  }
  var payload = null;
  try {
    payload = jwt.verify(accessToken, TOKEN_KEY);
  } catch (err) {
    return res.status(401).send();
  }
  return res.status(200).send(payload);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send(err.message);
})

module.exports = app;
