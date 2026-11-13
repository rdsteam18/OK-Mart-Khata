// OK Mart Khata — shared Firebase config + init (2026-11-13).
// ONE copy of the config; every page imports { auth, db } from here.
// Values are byte-identical to the per-page configs they replace
// (measurementId included — it was present in customers.html + login.html).
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAWL9DQhuyah1ntZgUwqFHegWcm_uvKyus",
    authDomain: "ok-mart-khata.firebaseapp.com",
    projectId: "ok-mart-khata",
    storageBucket: "ok-mart-khata.firebasestorage.app",
    messagingSenderId: "334851811921",
    appId: "1:334851811921:web:804863c35baa17dd61a670",
    measurementId: "G-GFM55V38D2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
