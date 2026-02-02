importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyBwfUNRFK2D8StRtUQXcuBrXs1wZVIRbtU",
    authDomain: "nipah-tracker.firebaseapp.com",
    projectId: "nipah-tracker",
    storageBucket: "nipah-tracker.firebasestorage.app",
    messagingSenderId: "786979842657",
    appId: "1:786979842657:web:21b566c5956cad5a0cd820",
    measurementId: "G-X94T6M1W3K"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log(
        '[firebase-messaging-sw.js] Received background message ',
        payload
    );
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/favicon.svg'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
