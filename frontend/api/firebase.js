const admin = require('firebase-admin');



// Replace the path with the path to your service account key file
const serviceAccount = require('./firebase-data.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
//   databaseURL: 'https://resume-app-15b91.firebaseio.com/'
});

var db = admin.firestore();


module.exports = {admin, db };
