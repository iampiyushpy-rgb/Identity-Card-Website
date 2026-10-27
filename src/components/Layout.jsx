import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Close mobile sidebar on route transition
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => setMobileOpen((prev) => !prev);
  const closeSidebar = () => setMobileOpen(false);

  return (
    <div className="app-container">
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={closeSidebar}
          aria-label="Close menu backdrop"
        />
      )}

      <Sidebar isOpen={mobileOpen} onClose={closeSidebar} />

      <div className="main-content">
        <Navbar onToggleMenu={toggleSidebar} />
        <main className="page-wrapper">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

