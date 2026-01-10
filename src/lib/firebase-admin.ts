import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

let app: App;
let adminDb: Firestore;
let adminAuth: Auth;

// Initialize Firebase Admin
function initializeFirebaseAdmin() {
    if (getApps().length === 0) {
        const serviceAccount = {
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        };

        app = initializeApp({
            credential: cert(serviceAccount),
            projectId: process.env.FIREBASE_PROJECT_ID,
        });
    } else {
        app = getApps()[0];
    }

    adminDb = getFirestore(app);
    adminAuth = getAuth(app);
}

// Initialize on import
try {
    initializeFirebaseAdmin();
} catch (error) {
    console.warn('Firebase Admin initialization failed:', error);
    console.warn('Server-side Firebase operations will not work.');
}

export { adminDb, adminAuth };
