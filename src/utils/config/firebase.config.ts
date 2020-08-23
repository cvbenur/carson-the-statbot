import firebase from 'firebase/app';
import admin, { firestore, ServiceAccount } from 'firebase-admin';
const FieldValue = firestore.FieldValue;
import serviceAccount from '../../../serviceAccount.json';


admin.initializeApp({
  credential: admin.credential.cert((serviceAccount as ServiceAccount)),
  databaseURL: 'https://carson-the-statbot.firebaseio.com',
});


export const db = admin.firestore();
export const guildsCollection = db.collection('guilds');
