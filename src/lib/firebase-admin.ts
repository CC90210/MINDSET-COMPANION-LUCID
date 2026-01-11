import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

let app: App;
let adminDb: Firestore;
let adminAuth: Auth;

// Initialize Firebase Admin
function initializeFirebaseAdmin() {
    if (getApps().length === 0) {
        let serviceAccount: any;

        if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
            try {
                // If the variable is a JSON string
                serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
            } catch (error) {
                console.warn('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY as JSON. Using individual variables.');
            }
        }

        if (!serviceAccount) {
            serviceAccount = {
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            };
        }

        // Validate required fields to prevent opaque errors
        if (!serviceAccount.projectId && !serviceAccount.project_id) {
            throw new Error('FIREBASE_PROJECT_ID (or project_id in JSON) is missing');
        }
        if (!serviceAccount.clientEmail && !serviceAccount.client_email) {
            throw new Error('FIREBASE_CLIENT_EMAIL (or client_email in JSON) is missing');
        }
        if (!serviceAccount.privateKey && !serviceAccount.private_key) {
            throw new Error('FIREBASE_PRIVATE_KEY (or private_key in JSON) is missing');
        }

        app = initializeApp({
            credential: cert(serviceAccount),
            projectId: serviceAccount.projectId || serviceAccount.project_id,
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
