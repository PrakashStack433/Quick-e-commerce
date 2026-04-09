// ============================================================
// QuickBite — Firebase Database Setup
// Run this ONCE to initialize collections and sample data
// npm install firebase
// node firebase-setup.js
// ============================================================

import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, serverTimestamp } from "firebase/firestore";

// ✅ Replace with YOUR Firebase config from console.firebase.google.com
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
const db = getFirestore(app);

// ============================================================
// DATABASE SCHEMA
// ============================================================
//
// Firestore Collections:
//
// 📁 users/          — all app users (customers + riders + admins)
// 📁 riders/         — rider-specific data (vehicle, approval, stats)
// 📁 menu_items/     — food items shown in the store
// 📁 orders/         — all customer orders
// 📁 cart/           — per-user active cart (optional, can use localStorage)
// 📁 settings/       — app-wide config (delivery radius, fees, etc.)
//
// ============================================================

async function setupDatabase() {
  console.log("🔥 Setting up QuickBite Firebase database...\n");

  // ----------------------------------------------------------
  // 1. SETTINGS — app-wide configuration
  // ----------------------------------------------------------
  await setDoc(doc(db, "settings", "app_config"), {
    deliveryFee: 25,
    platformFee: 5,
    deliveryRadiusKm: 5,
    estimatedDeliveryMins: 30,
    storeOpen: true,
    storeOpenTime: "08:00",
    storeCloseTime: "23:59",
    currency: "INR",
    currencySymbol: "₹",
    city: "Agra",
    state: "Uttar Pradesh",
    updatedAt: serverTimestamp()
  });
  console.log("✅ Settings saved");

  // ----------------------------------------------------------
  // 2. MENU ITEMS
  // ----------------------------------------------------------
  const menuItems = [
    { id: "item_001", name: "Chicken Biryani", category: "Biryani", price: 149, emoji: "🍚", rating: 4.8, available: true, prepTimeMins: 15, description: "Aromatic basmati rice with tender chicken" },
    { id: "item_002", name: "Veg Biryani", category: "Biryani", price: 99, emoji: "🥘", rating: 4.6, available: true, prepTimeMins: 12 },
    { id: "item_003", name: "Mutton Biryani", category: "Biryani", price: 199, emoji: "🍲", rating: 4.9, available: true, prepTimeMins: 20 },
    { id: "item_004", name: "Samosa (2 pcs)", category: "Snacks", price: 25, emoji: "🥟", rating: 4.7, available: true, prepTimeMins: 5 },
    { id: "item_005", name: "Aloo Tikki", category: "Snacks", price: 40, emoji: "🥙", rating: 4.5, available: true, prepTimeMins: 8 },
    { id: "item_006", name: "Pav Bhaji", category: "Snacks", price: 80, emoji: "🍛", rating: 4.8, available: true, prepTimeMins: 10 },
    { id: "item_007", name: "Margherita Pizza", category: "Pizza", price: 179, emoji: "🍕", rating: 4.6, available: true, prepTimeMins: 18 },
    { id: "item_008", name: "Paneer Pizza", category: "Pizza", price: 199, emoji: "🍕", rating: 4.7, available: true, prepTimeMins: 18 },
    { id: "item_009", name: "Masala Chai", category: "Drinks", price: 20, emoji: "☕", rating: 4.9, available: true, prepTimeMins: 3 },
    { id: "item_010", name: "Mango Lassi", category: "Drinks", price: 60, emoji: "🥛", rating: 4.8, available: true, prepTimeMins: 5 },
    { id: "item_011", name: "Cold Coffee", category: "Drinks", price: 80, emoji: "🧋", rating: 4.6, available: true, prepTimeMins: 5 },
    { id: "item_012", name: "Gulab Jamun", category: "Desserts", price: 50, emoji: "🍮", rating: 4.9, available: true, prepTimeMins: 5 },
    { id: "item_013", name: "Rabri Kulfi", category: "Desserts", price: 70, emoji: "🍧", rating: 4.8, available: true, prepTimeMins: 5 },
    { id: "item_014", name: "Egg Roll", category: "Rolls", price: 60, emoji: "🌯", rating: 4.5, available: true, prepTimeMins: 8 },
    { id: "item_015", name: "Paneer Roll", category: "Rolls", price: 70, emoji: "🌯", rating: 4.7, available: true, prepTimeMins: 8 },
    { id: "item_016", name: "Crispy Fries", category: "Snacks", price: 55, emoji: "🍟", rating: 4.4, available: true, prepTimeMins: 8 },
  ];

  for (const item of menuItems) {
    await setDoc(doc(db, "menu_items", item.id), {
      ...item,
      createdAt: serverTimestamp()
    });
  }
  console.log(`✅ ${menuItems.length} menu items saved`);

  // ----------------------------------------------------------
  // 3. SAMPLE ADMIN USER
  // Create this in Firebase Auth console first, then add Firestore doc
  // ----------------------------------------------------------
  await setDoc(doc(db, "users", "ADMIN_UID_FROM_FIREBASE_AUTH"), {
    uid: "ADMIN_UID_FROM_FIREBASE_AUTH",
    email: "admin@quickbite.in",
    name: "QuickBite Admin",
    role: "admin",
    phone: null,
    isActive: true,
    createdAt: serverTimestamp()
  });
  console.log("✅ Admin user doc created (update UID after creating in Firebase Auth)");

  console.log("\n🎉 Database setup complete!");
  console.log("\n📋 Collections created:");
  console.log("   - settings/app_config");
  console.log("   - menu_items/ (16 items)");
  console.log("   - users/ (admin placeholder)");
  console.log("\n📋 Collections auto-created on first use:");
  console.log("   - orders/");
  console.log("   - riders/");
}

setupDatabase().catch(console.error);


// ============================================================
// FULL DOCUMENT SCHEMAS (for reference)
// ============================================================

/*

── users/{uid} ──────────────────────────────────────────────
{
  uid:          "firebase_auth_uid",
  phone:        "+919876543210",     // null for Google login
  email:        "user@email.com",    // null for phone login
  name:         "Ravi Kumar",
  role:         "customer",          // "customer" | "rider" | "admin"
  addresses: [
    {
      label: "Home",
      full: "12 Taj Road, Agra 282001",
      lat: 27.1767,
      lng: 78.0081
    }
  ],
  isActive:     true,
  createdAt:    Timestamp,
  lastLoginAt:  Timestamp
}

── riders/{uid} ─────────────────────────────────────────────
{
  uid:           "firebase_auth_uid",
  name:          "Mohan Singh",
  phone:         "+919876543210",
  approved:      true,               // ← admin must set true to allow login
  online:        false,
  vehicleType:   "bike",
  vehicleNumber: "UP80 AB 1234",
  currentLat:    27.1767,
  currentLng:    78.0081,
  stats: {
    deliveredToday:  5,
    totalDelivered:  128,
    earningsToday:   175,
    totalEarnings:   4480,
    rating:          4.9
  },
  createdAt:     Timestamp
}

── menu_items/{itemId} ──────────────────────────────────────
{
  id:           "item_001",
  name:         "Chicken Biryani",
  category:     "Biryani",
  price:        149,
  emoji:        "🍚",
  rating:       4.8,
  description:  "Aromatic basmati rice with tender chicken",
  available:    true,
  prepTimeMins: 15,
  imageUrl:     "https://...",       // optional
  createdAt:    Timestamp
}

── orders/{orderId} ─────────────────────────────────────────
{
  orderId:       "QB-4821",
  customerId:    "firebase_auth_uid",
  customerPhone: "+919876543210",
  riderId:       null,               // assigned after acceptance
  items: [
    { itemId: "item_001", name: "Chicken Biryani", price: 149, qty: 2 },
    { itemId: "item_009", name: "Masala Chai",      price: 20,  qty: 1 }
  ],
  deliveryAddress: {
    full: "12 Taj Road, Agra 282001",
    lat:  27.1767,
    lng:  78.0081
  },
  pricing: {
    subtotal:     318,
    deliveryFee:  25,
    platformFee:  5,
    total:        348
  },
  paymentMethod:  "COD",             // "COD" | "online"
  paymentStatus:  "pending",         // "pending" | "paid"
  status:         "placed",
  // Status flow:
  //   placed → confirmed → preparing → ready → picked_up → delivered | cancelled
  statusHistory: [
    { status: "placed", at: Timestamp }
  ],
  estimatedDeliveryMins: 30,
  createdAt:      Timestamp,
  updatedAt:      Timestamp
}

── settings/app_config ──────────────────────────────────────
{
  deliveryFee:          25,
  platformFee:          5,
  deliveryRadiusKm:     5,
  estimatedDeliveryMins:30,
  storeOpen:            true,
  currency:             "INR",
  currencySymbol:       "₹",
  city:                 "Agra"
}

*/
