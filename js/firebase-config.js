// ============================================================
//  PARAGIS BILA BILA — Firebase Configuration
//  Replace the firebaseConfig values below with your own
//  Firebase project credentials from:
//  https://console.firebase.google.com → Project Settings → General
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth }        from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore }   from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage }     from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// ── YOUR FIREBASE PROJECT CONFIG ──────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyAhw3tXa49RJwsejW13cVi9I8qke0Y3bGA",
  authDomain: "paragis-bila-bila.firebaseapp.com",
  projectId: "paragis-bila-bila",
  storageBucket: "paragis-bila-bila.firebasestorage.app",
  messagingSenderId: "815030240560",
  appId: "1:815030240560:web:760eeb7ef7feb35f25b4f5",
  measurementId: "G-L1NRVPD1EZ"
};

// ── INITIALIZE ─────────────────────────────────────────────
const app     = initializeApp(firebaseConfig);
const auth    = getAuth(app);
const db      = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
