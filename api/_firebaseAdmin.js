// api/_firebaseAdmin.js
import admin from "firebase-admin";

let initialized = false;

/**
 * Get Firebase Admin SDK instance
 * Prevents reinitialization in serverless environment
 */
export function getAdmin() {
  if (!initialized) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
      initialized = true;
      console.log('✅ Firebase Admin initialized');
    } catch (error) {
      console.error('❌ Firebase Admin initialization failed:', error);
      throw error;
    }
  }
  
  return { 
    db: admin.firestore(), 
    auth: admin.auth() 
  };
}

