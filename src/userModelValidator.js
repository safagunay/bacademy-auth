var config = require("./config");
function validate(email, password) {
    var error = { custom: true };
    if (!email || !password) {
        error.statusCode = 401;
        error.message = "Email and password is required.";
        return error;
    }
    else if (!email.endsWith(config.validDomain)) {
        error.statusCode = 401;
        error.message = `Only "${config.validDomain}" emails are accepted`;
        return error;
    }
    return null;
}

module.exports = validate;