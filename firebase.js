// backend/firebase.js
const admin = require('firebase-admin');
const dotenv = require('dotenv');
const serviceAccount = require('./firebaseServiceAccount.json');

dotenv.config();

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('Firebase Admin initialized');
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
}

module.exports = admin;
