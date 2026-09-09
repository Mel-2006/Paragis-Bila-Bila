// ============================================================
//  PARAGIS BILA BILA — Core App Utilities & Firebase Helpers
// ============================================================

import { auth, db, storage }    from './firebase-config.js';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
  sendPasswordResetEmail,
  EmailAuthProvider,
  reauthenticateWithCredential
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  collection, doc, addDoc, setDoc, getDoc, getDocs,
  updateDoc, deleteDoc, query, where, orderBy, limit,
  onSnapshot, serverTimestamp, increment, Timestamp,
  writeBatch
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// ── AUTH GUARD ─────────────────────────────────────────────
export function requireAuth(redirectTo = 'index.html') {
  onAuthStateChanged(auth, user => {
    if (!user) window.location.href = redirectTo;
  });
}

export function requireGuest(redirectTo = 'dashboard.html') {
  onAuthStateChanged(auth, user => {
    if (user) window.location.href = redirectTo;
  });
}

// ── LOGIN / LOGOUT ─────────────────────────────────────────
export async function loginUser(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function logoutUser() {
  await signOut(auth);
  window.location.href = 'index.html';
}

// ── FORGOT PASSWORD ────────────────────────────────────────
export async function resetPassword(email) {
  return sendPasswordResetEmail(auth, email);
}

// ── CURRENT USER ───────────────────────────────────────────
export function getCurrentUser() {
  return auth.currentUser;
}

// ── TOAST NOTIFICATIONS ────────────────────────────────────
export function showToast(message, type = 'success', duration = 3500) {
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <span class="toast-msg">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ── LOADING OVERLAY ────────────────────────────────────────
export function showLoading(msg = 'Loading...') {
  let overlay = document.getElementById('loading-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `<div class="spinner"></div><p class="loading-text">${msg}</p>`;
    document.body.appendChild(overlay);
  }
  overlay.style.display = 'flex';
}

export function hideLoading() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) overlay.style.display = 'none';
}

// ── MODAL HELPERS ──────────────────────────────────────────
export function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('open');
}

export function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('open');
}

export function closeModalOnOverlay(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.addEventListener('click', e => {
      if (e.target === modal) modal.classList.remove('open');
    });
  }
}

// ── FORMAT CURRENCY (Peso) ─────────────────────────────────
export function formatPeso(amount) {
  if (isNaN(amount)) return '₱0.00';
  return '₱' + parseFloat(amount).toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// ── FORMAT DATE ────────────────────────────────────────────
export function formatDate(ts) {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatDateTime(ts) {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleString('en-PH', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

export function todayString() {
  return new Date().toLocaleDateString('en-PH', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
}

// ── SIDEBAR ACTIVE STATE ───────────────────────────────────
export function setActiveNav(page) {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.dataset.page === page) item.classList.add('active');
  });
}

// ── MOBILE SIDEBAR TOGGLE ──────────────────────────────────
export function initMobileSidebar() {
  const menuBtn  = document.getElementById('menu-btn');
  const sidebar  = document.getElementById('sidebar');
  const overlay  = document.getElementById('sidebar-overlay');

  if (menuBtn && sidebar) {
    menuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      if (overlay) overlay.classList.toggle('open');
    });
  }

  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('open');
    });
  }
}

// ── FIREBASE: PRODUCTS ─────────────────────────────────────
export async function getProducts() {
  try {
    // Try with orderBy first (requires Firestore index)
    const snap = await getDocs(query(collection(db, 'products'), orderBy('createdAt', 'desc')));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    // Fallback: fetch without ordering (works even without index)
    console.warn('getProducts: orderBy failed, falling back to unordered fetch.', err.message);
    const snap = await getDocs(collection(db, 'products'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }
}

export async function addProduct(data) {
  return addDoc(collection(db, 'products'), { ...data, createdAt: serverTimestamp() });
}

export async function updateProduct(id, data) {
  return updateDoc(doc(db, 'products', id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteProduct(id) {
  return deleteDoc(doc(db, 'products', id));
}

// ── FIREBASE: CATEGORIES ───────────────────────────────────
export async function getCategories() {
  const snap = await getDocs(collection(db, 'categories'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addCategory(data) {
  return addDoc(collection(db, 'categories'), { ...data, createdAt: serverTimestamp() });
}

export async function deleteCategory(id) {
  return deleteDoc(doc(db, 'categories', id));
}

// ── FIREBASE: INVENTORY / STOCK MOVEMENTS ─────────────────
export async function addStockMovement(data) {
  const batch = writeBatch(db);
  const movRef = doc(collection(db, 'stock_movements'));
  batch.set(movRef, { ...data, createdAt: serverTimestamp() });

  const prodRef = doc(db, 'products', data.productId);
  const delta   = data.type === 'in' ? data.quantity : -data.quantity;
  batch.update(prodRef, { stock: increment(delta), updatedAt: serverTimestamp() });

  return batch.commit();
}

export async function getStockMovements(productId = null) {
  try {
    let q = productId
      ? query(collection(db, 'stock_movements'), where('productId', '==', productId), orderBy('createdAt', 'desc'))
      : query(collection(db, 'stock_movements'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.warn('getStockMovements: orderBy failed, falling back.', err.message);
    let q = productId
      ? query(collection(db, 'stock_movements'), where('productId', '==', productId))
      : collection(db, 'stock_movements');
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }
}

// ── FIREBASE: SALES ────────────────────────────────────────
export async function addSale(data) {
  const batch  = writeBatch(db);
  const saleRef = doc(collection(db, 'sales'));
  batch.set(saleRef, { ...data, createdAt: serverTimestamp() });

  // Deduct stock for each item
  for (const item of data.items) {
    const prodRef = doc(db, 'products', item.productId);
    batch.update(prodRef, { stock: increment(-item.quantity), updatedAt: serverTimestamp() });
  }

  return batch.commit();
}

export async function getSales(startDate = null, endDate = null) {
  try {
    let q;
    if (startDate && endDate) {
      q = query(collection(db, 'sales'),
        where('createdAt', '>=', Timestamp.fromDate(new Date(startDate))),
        where('createdAt', '<=', Timestamp.fromDate(new Date(endDate + 'T23:59:59'))),
        orderBy('createdAt', 'desc'));
    } else {
      q = query(collection(db, 'sales'), orderBy('createdAt', 'desc'));
    }
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.warn('getSales: orderBy failed, falling back.', err.message);
    const snap = await getDocs(collection(db, 'sales'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }
}

// ── FIREBASE: DASHBOARD STATS ──────────────────────────────
export async function getDashboardStats() {
  const [products, sales] = await Promise.all([getProducts(), getSales()]);

  const totalProducts = products.length;
  const totalStock    = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const lowStock      = products.filter(p => (p.stock || 0) <= (p.minStock || 5)).length;
  const inventoryValue = products.reduce((sum, p) => sum + ((p.stock || 0) * (p.price || 0)), 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todaySales = sales
    .filter(s => s.createdAt && s.createdAt.toDate() >= today)
    .reduce((sum, s) => sum + (s.total || 0), 0);

  return { totalProducts, totalStock, lowStock, inventoryValue, todaySales, totalSales: sales.length };
}

// ── FIREBASE: SETTINGS / PROFILE ──────────────────────────
export async function getProfile() {
  const user = auth.currentUser;
  if (!user) return null;
  const snap = await getDoc(doc(db, 'users', user.uid));
  return snap.exists() ? { uid: user.uid, email: user.email, ...snap.data() } : { uid: user.uid, email: user.email };
}

export async function updateProfile(data) {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  return setDoc(doc(db, 'users', user.uid), data, { merge: true });
}

export async function changePassword(currentPassword, newPassword) {
  const user = auth.currentUser;
  const cred = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, cred);
  return updatePassword(user, newPassword);
}

// ── IMAGE UPLOAD ───────────────────────────────────────────
export async function uploadProductImage(file, productId) {
  const ref  = storageRef(storage, `products/${productId}_${Date.now()}`);
  const snap = await uploadBytes(ref, file);
  return getDownloadURL(snap.ref);
}
