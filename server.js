require("dotenv").config();
const app = require("./src/app");
const port = process.env.PORT || 3000;
// Start the server
const server = app.listen(port, function () {
  const host = server.address().address;
  const port = server.address().port;

  console.log("Server listening at http://%s:%s", host, port);
});
