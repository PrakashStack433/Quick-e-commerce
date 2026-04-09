# Quick-e-commerce
A Quick e-commerce app for food delivery.
A full-stack food delivery web application built for fast, hyperlocal delivery. Customers browse and order food, delivery riders manage pickups and navigation, and admins control the entire platform — all in one codebase.

---

## ✨ Features

### 🛍️ Customer View
- Browse the full menu with category filters (Biryani, Snacks, Pizza, Drinks, Desserts, Rolls)
- Live search across all food items
- Add to cart with quantity controls
- Checkout with delivery address and itemised billing
- Real-time order tracking (Placed → Preparing → Out for Delivery → Delivered)
- Login via Phone OTP or Google account

### 🛵 Delivery Boy Dashboard
- Separate role-based login (admin-approved accounts only)
- Toggle online/offline availability
- View active and pending orders in real time
- One-tap navigation via Google Maps, Ola Maps, or Waze
- Advance order status through each stage
- Daily stats — deliveries completed, earnings, rating

### ⚙️ Admin
- Secure email/password login
- Manage menu items and availability via Firestore
- Approve/block rider accounts
- Full order history across all users

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, Vanilla JavaScript |
| Authentication | Firebase Auth (Phone OTP + Google) |
| Database | Firebase Firestore (NoSQL, real-time) |
| Hosting | Firebase Hosting / Vercel / Netlify |
| Navigation | Google Maps, Ola Maps, Waze (deep links) |
| Payments (planned) | Razorpay / PhonePe |
| SMS Alerts (planned) | MSG91 / Twilio |

---

## 📁 Project Structure

```
quickbite/
├── index.html          # Main app — Customer, Cart, Order tracking, Delivery dashboard
├── login.html          # Role-based login — Customer / Delivery Boy / Admin
├── auth-guard.js       # Firebase auth check, Firestore read/write helpers
├── firebase-setup.js   # One-time DB initialisation script (run with Node.js)
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/quickbite.git
cd quickbite
```

### 2. Set up Firebase

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and create a new project named `quickbite`
2. Enable **Authentication** → turn on **Phone** and **Google** sign-in methods
3. Enable **Firestore Database** → start in test mode
4. Go to Project Settings → copy your `firebaseConfig` object
5. Replace the `YOUR_API_KEY` placeholder in these three files:
   - `login.html`
   - `auth-guard.js`
   - `firebase-setup.js`

### 3. Initialise the database
```bash
npm install firebase
node firebase-setup.js
```

This seeds Firestore with all 16 menu items, default app settings, and document schemas for users, riders, and orders.

### 4. Open the app

Just open `login.html` in your browser, or serve with:
```bash
npx serve .
```

---

## 🗄️ Firestore Database Schema

### `users/{uid}`
```json
{
  "uid": "firebase_uid",
  "phone": "+919876543210",
  "email": "user@email.com",
  "name": "Ravi Kumar",
  "role": "customer",
  "isActive": true,
  "createdAt": "Timestamp"
}
```

### `orders/{orderId}`
```json
{
  "orderId": "QB-4821",
  "customerId": "firebase_uid",
  "items": [{ "itemId": "item_001", "name": "Chicken Biryani", "price": 149, "qty": 2 }],
  "deliveryAddress": { "full": "12 Taj Road, Agra", "lat": 27.17, "lng": 78.00 },
  "pricing": { "subtotal": 298, "deliveryFee": 25, "platformFee": 5, "total": 328 },
  "status": "placed",
  "paymentMethod": "COD",
  "createdAt": "Timestamp"
}
```

### `riders/{uid}`
```json
{
  "approved": true,
  "online": false,
  "vehicleNumber": "UP80 AB 1234",
  "stats": { "deliveredToday": 5, "earningsToday": 175, "rating": 4.9 }
}
```

### `menu_items/{itemId}`
```json
{
  "name": "Chicken Biryani",
  "category": "Biryani",
  "price": 149,
  "emoji": "🍚",
  "available": true,
  "prepTimeMins": 15
}
```

**Order status flow:**
```
placed → confirmed → preparing → ready → picked_up → delivered
                                                    ↘ cancelled
```

---

## 🔐 Role-Based Access

| Role | Login Method | Access |
|---|---|---|
| Customer | Phone OTP or Google | Menu, cart, order tracking |
| Delivery Boy | Phone OTP (must be approved) | Delivery dashboard only |
| Admin | Email + Password | Admin panel, all orders, rider management |

Riders cannot log in until an admin sets `approved: true` in their Firestore document (`riders/{uid}`).

---

## 🔗 How Login Connects to the Main App

`auth-guard.js` runs automatically when `index.html` loads. It checks Firebase Auth state and:
- Redirects unauthenticated users to `login.html`
- Shows the Customer view for role `customer`
- Shows the Delivery dashboard for role `rider`
- Redirects role `admin` to `admin.html`

After a successful login in `login.html`, users are sent to:
- `index.html` — customers and riders
- `admin.html` — admin users

---

## 📦 Planned Features

- [ ] Razorpay / PhonePe online payment integration
- [ ] Real-time GPS tracking with Google Maps JS API
- [ ] SMS order updates via MSG91
- [ ] Push notifications for riders via Firebase Cloud Messaging
- [ ] Admin panel UI for managing menu, orders, and riders
- [ ] Order history page for customers
- [ ] Review and rating system

---

## 📄 License

MIT License — free to use and modify for personal or commercial projects.

---

## 🙌 Built With

- [Firebase](https://firebase.google.com/) — Auth + Firestore
- [Google Fonts](https://fonts.google.com/) — Syne + DM Sans
- [Google Maps](https://maps.google.com/) — Navigation deep links

---

> Built for Agra, UP 🇮🇳 — delivering in 30 minutes or less
