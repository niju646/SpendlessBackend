import * as admin from 'firebase-admin';
import * as serviceAccount from 'spendless-55abf-firebase-adminsdk-fbsvc-b432ba12ca.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export default admin;
