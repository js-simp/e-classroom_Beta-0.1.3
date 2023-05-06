const functions = require("firebase-functions");
const { getAuth } = require('firebase-admin/auth');
const admin = require('firebase-admin');
admin.initializeApp();

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.addRole = functions.https.onCall((data, context) => {
    // ...
    // Set admin privilege on the user corresponding to uid.
    return getAuth()
    .getUserByEmail(data.email)
    .then((userRecord) => {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log(`Successfully fetched user data: ${userRecord.toJSON()}`);
      return getAuth()
        .setCustomUserClaims(userRecord.uid, { role : data.role })
        .then(() => {
        // The new custom claims will propagate to the user's ID token the
        // next time a new one is issued.
        return {
            message : `Sucessfully given role ${data.role}`
        }
        });
    })
    .catch((error) => {
      console.log('Error fetching user data:', error);
      return error;
    });
  });