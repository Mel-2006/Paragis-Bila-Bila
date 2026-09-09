// ============================================================
//  SHARED SIDEBAR HTML — injected into every page
// ============================================================

export function renderSidebar(activePage) {
  return `
  <div id="sidebar-overlay" class="sidebar-overlay"></div>
  <aside class="sidebar" id="sidebar">
    <a href="dashboard.html" class="sidebar-brand">
      <div class="sidebar-brand-logo">🌿</div>
      <div class="sidebar-brand-text">
        <div class="sidebar-brand-name">Paragis Bila Bila</div>
        <div class="sidebar-brand-sub">Natural Herbal Medicine</div>
      </div>
    </a>

    <nav class="sidebar-nav">
      <div class="nav-section-label">Main Menu</div>

      <a href="dashboard.html" class="nav-item ${activePage === 'dashboard' ? 'active' : ''}" data-page="dashboard">
        <span class="nav-icon">🏠</span> Dashboard
      </a>
      <a href="products.html" class="nav-item ${activePage === 'products' ? 'active' : ''}" data-page="products">
        <span class="nav-icon">📦</span> Products
      </a>
      <a href="inventory.html" class="nav-item ${activePage === 'inventory' ? 'active' : ''}" data-page="inventory">
        <span class="nav-icon">🗂️</span> Inventory
      </a>
      <a href="sales.html" class="nav-item ${activePage === 'sales' ? 'active' : ''}" data-page="sales">
        <span class="nav-icon">🛒</span> Sales
      </a>
      <a href="reports.html" class="nav-item ${activePage === 'reports' ? 'active' : ''}" data-page="reports">
        <span class="nav-icon">📊</span> Reports
      </a>
      <a href="categories.html" class="nav-item ${activePage === 'categories' ? 'active' : ''}" data-page="categories">
        <span class="nav-icon">🏷️</span> Categories
      </a>
      <a href="settings.html" class="nav-item ${activePage === 'settings' ? 'active' : ''}" data-page="settings">
        <span class="nav-icon">⚙️</span> Settings
      </a>
    </nav>

    <div class="sidebar-footer">
      <div class="sidebar-user">
        <div class="sidebar-user-avatar" id="sb-avatar">A</div>
        <div class="sidebar-user-info">
          <div class="sidebar-user-name" id="sb-username">Admin</div>
          <div class="sidebar-user-role">Administrator</div>
        </div>
      </div>
      <button class="btn-logout" id="logout-btn">
        <span>🚪</span> Logout
      </button>
    </div>
  </aside>`;
}

export function renderHeader(title, subtitle) {
  return `
  <header class="top-header">
    <button class="header-menu-btn" id="menu-btn">☰</button>
    <div class="header-title">
      <h1>${title}</h1>
      ${subtitle ? `<p>${subtitle}</p>` : ''}
    </div>
    <div class="header-actions">
      <span class="header-date" id="header-date"></span>
      <div class="header-notif" title="Notifications">
        🔔
        <span class="notif-dot" id="notif-dot" style="display:none"></span>
      </div>
      <div class="header-user">
        <div class="header-avatar" id="hdr-avatar">A</div>
        <span class="header-user-name" id="hdr-username">Admin</span>
      </div>
    </div>
  </header>`;
}
