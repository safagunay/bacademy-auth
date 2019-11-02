const config = require("./config");
const axios = require("axios");

function getToken(email, password) {
  var options = {
    url: config.tokenUrl,
    method: "post",
    headers: {
      ApplicationType: process.env.APP_TYPE,
      ApplicationGUID: process.env.APP_GUID,
      ApplicationDeploymentGUID: process.env.APP_DEPLOYMENT_GUID,
      username: email,
      password: password,
      "Cache-Control": "no-cache",
      "Content-Type": "application/json; charset=utf-8"
    }
  };
  var error = { custom: true };
  return axios(options)
    .then(response => {
      var token = response.data;
      if (token.ExceptionMessage === null) {
        return token;
      } else {
        error.message = "Invalid email or password.";
        error.statusCode = 401;
        // drop to catch block here !
        return Promise.reject(error);
      }
    })
    .catch(err => {
      if (!err.custom) {
        error.statusCode = 500;
        error.message = "Error connecting to external login service!";
        error.error = err
      }
      return Promise.reject(error);
    })
}

module.exports = {
  getToken
};
