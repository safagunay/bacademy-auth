//test if fb requires password when creating user
var admin = require("../fbadmin");
admin
  .auth()
  .createUser({
    email: "user@example.com",
    emailVerified: false,
    phoneNumber: "+11234567890",
    displayName: "John Doe",
    photoURL: "http://www.example.com/12345678/photo.png",
    disabled: false
  })
  .then(function (userRecord) {
    // See the UserRecord reference doc for the contents of userRecord.
    console.log("Successfully created new user:", userRecord.uid);
  })
  .catch(function (error) {
    console.log("Error creating new user:", error);
  });
