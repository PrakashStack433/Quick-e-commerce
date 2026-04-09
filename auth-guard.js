// ============================================================
// auth-guard.js — Paste this into your index.html <script type="module">
// This checks if user is logged in, and redirects if not.
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc, collection, query, where, onSnapshot, addDoc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ✅ Same config as login.html
const firebaseConfig = {
  apiKey: "AIzaSyC7YVJUbsDX0QijapJkymj39PQjVp8KiTc",
  authDomain: "quickbite-aaa98.firebaseapp.com",
  projectId: "quickbite-aaa98",
  storageBucket: "quickbite-aaa98.firebasestorage.app",
  messagingSenderId: "515219088862",
  appId: "1:515219088862:web:63caec2d22ffd02c0ae94f",
  measurementId: "G-MG47RJZKVJ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUser = null;
let currentUserRole = null;

// ── 1. AUTH GUARD ────────────────────────────────────────────
// Runs on every page load. Redirects to login if not signed in.
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    // Not logged in → go to login page
    window.location.href = 'login.html';
    return;
  }

  currentUser = user;

  // Get role from Firestore
  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (userDoc.exists()) {
    currentUserRole = userDoc.data().role;
  } else {
    currentUserRole = localStorage.getItem('qb_user_role') || 'customer';
  }

  // Auto-show correct view based on role
  if (currentUserRole === 'rider') {
    // Show delivery dashboard by default
    showScreen('screen-delivery');
  } else if (currentUserRole === 'admin') {
    window.location.href = 'admin.html';
  } else {
    showScreen('screen-customer');
  }

  // Hide the delivery mode button for non-riders
  if (currentUserRole !== 'rider') {
    const riderBtn = document.querySelector('[onclick="showScreen(\'screen-delivery\')"]');
    if (riderBtn) riderBtn.style.display = 'none';
  }
});

// ── 2. PLACE ORDER — saves to Firestore ─────────────────────
window.placeOrderDB = async (cartItems, address) => {
  if (!currentUser) { alert('Please login first'); return; }

  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const orderId = 'QB-' + Math.floor(1000 + Math.random() * 9000);

  const orderData = {
    orderId,
    customerId: currentUser.uid,
    customerPhone: currentUser.phoneNumber || null,
    riderId: null,
    items: cartItems,
    deliveryAddress: { full: address, lat: null, lng: null },
    pricing: {
      subtotal,
      deliveryFee: 25,
      platformFee: 5,
      total: subtotal + 30
    },
    paymentMethod: "COD",
    paymentStatus: "pending",
    status: "placed",
    statusHistory: [{ status: "placed", at: serverTimestamp() }],
    estimatedDeliveryMins: 30,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  await addDoc(collection(db, "orders"), orderData);
  return orderId;
};

// ── 3. LOAD MENU from Firestore ──────────────────────────────
window.loadMenuFromDB = async () => {
  const { getDocs } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
  const snap = await getDocs(collection(db, "menu_items"));
  return snap.docs
    .map(d => d.data())
    .filter(item => item.available)
    .sort((a,b) => a.name.localeCompare(b.name));
};

// ── 4. LISTEN TO ORDERS (for delivery boy) ───────────────────
window.listenToOrders = (callback) => {
  const q = query(
    collection(db, "orders"),
    where("status", "in", ["placed", "confirmed", "preparing", "ready", "picked_up"])
  );
  return onSnapshot(q, (snap) => {
    const orders = snap.docs.map(d => ({ dbId: d.id, ...d.data() }));
    callback(orders);
  });
};

// ── 5. UPDATE ORDER STATUS ───────────────────────────────────
window.updateOrderStatus = async (dbDocId, newStatus) => {
  const ref = doc(db, "orders", dbDocId);
  await updateDoc(ref, {
    status: newStatus,
    riderId: currentUser?.uid || null,
    updatedAt: serverTimestamp()
  });
};

// ── 6. LOGOUT ────────────────────────────────────────────────
window.logout = async () => {
  await auth.signOut();
  localStorage.clear();
  window.location.href = 'login.html';
};

export { db, auth, currentUser, currentUserRole };
