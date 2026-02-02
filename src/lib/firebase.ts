// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBwfUNRFK2D8StRtUQXcuBrXs1wZVIRbtU",
    authDomain: "nipah-tracker.firebaseapp.com",
    projectId: "nipah-tracker",
    storageBucket: "nipah-tracker.firebasestorage.app",
    messagingSenderId: "786979842657",
    appId: "1:786979842657:web:21b566c5956cad5a0cd820",
    measurementId: "G-X94T6M1W3K"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const messaging = typeof window !== "undefined" ? getMessaging(app) : null;

export const requestForToken = async () => {
    if (!messaging) return;
    try {
        const currentToken = await getToken(messaging, { vapidKey: 'BHNZlj7XVSwkmxsZclo820p4-9gf_m4yprDHV6kk6yDfPsFNwa1kGnlQ-rZ2QaFOhMwz_S4WB0xlVcgInd4jEhw' });

        // FOR MVP: We will just try default getting. If it fails due to missing VAPID, I will ask user.
        // Actually, explicit VAPID is recommended. 
        // Let's rely on standard flow first.

        if (currentToken) {
            console.log('current token for client: ', currentToken);
            // In a real app, you'd send this to your server db
            // await saveTokenToDatabase(currentToken);
            return currentToken;
        } else {
            console.log('No registration token available. Request permission to generate one.');
            return null;
        }
    } catch (err) {
        console.log('An error occurred while retrieving token. ', err);
        return null;
    }
};

export const onMessageListener = () =>
    new Promise((resolve) => {
        if (!messaging) return;
        onMessage(messaging, (payload) => {
            resolve(payload);
        });
    });
