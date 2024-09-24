import * as admin from 'firebase-admin';
import serviceAccount from './firebase-data.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // databaseURL: 'https://resume-app-15b91.firebaseio.com/'
});

const db = admin.firestore();

export { admin, db };
