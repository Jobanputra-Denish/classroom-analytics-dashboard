import React, { useState } from "react";
import { 
  LayoutDashboard, Users, ClipboardCheck, BookOpen, GraduationCap, 
  Settings, Bell, Search, Menu, X, ChevronRight, BarChart3 
} from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "./DashboardLayout.css";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={17} /> },
    { name: "Add Students", path: "/students", icon: <Users size={17} /> },
    { name: "View Students", path: "/view-students", icon: <Users size={17} /> },
    { name: "Attendance", path: "/attendance", icon: <ClipboardCheck size={17} /> },
    { name: "Marks", path: "/marks", icon: <BookOpen size={17} /> },
    { name: "View Marks", path: "/view-marks", icon: <BookOpen size={17} /> },
    { name: "Analytics", path: "/analytics", icon: <BarChart3 size={17} /> },
    { name: "Subjects", path: "/subjects", icon: <GraduationCap size={17} /> },
    { name: "View Subjects", path: "/view-subjects", icon: <GraduationCap size={17} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={17} /> },
  ];

  return (
    <div className="dashboard-layout-container">
      {/* MOBILE BACKDROP */}
      {sidebarOpen && (
        <div 
          className="sidebar-backdrop d-lg-none" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* PURPLE GRADIENT SIDEBAR */}
      <aside className={`app-sidebar ${sidebarOpen ? "sidebar-mobile-visible" : ""}`}>
        <div className="sidebar-inner">
          <div className="sidebar-branding">
            <div className="brand-logo">
              <div className="logo-icon">E</div>
              <span className="brand-name">EduMaster</span>
            </div>
            <button className="close-sidebar-btn d-lg-none" onClick={() => setSidebarOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <nav className="sidebar-nav">
            <ul className="nav-list">
              {menuItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={index}>
                    <Link 
                      to={item.path} 
                      className={`nav-item ${isActive ? "active" : ""}`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="nav-icon">{item.icon}</span>
                      <span className="nav-text">{item.name}</span>
                      {isActive && <ChevronRight size={14} className="active-arrow" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <div className="main-viewport">
        {/* HEADER TOPBAR */}
        <header className="topbar">
          <div className="topbar-left">
            <button className="mobile-toggle d-lg-none" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>

            <div className="search-bar">
              <Search size={16} className="search-icon" />
              <input type="text" placeholder="Search anything in EduMaster..." />
            </div>
          </div>

          <div className="topbar-right">
            <button className="icon-btn position-relative">
              <Bell size={18} />
              <span className="dot-indicator"></span>
            </button>

            <div className="v-divider"></div>

            <div className="admin-profile">
              {/* REPLACED <img> WITH OPTION 2 INLINE SVG AVATAR */}
              <svg
                width="36"
                height="36"
                viewBox="0 0 100 100"
                className="avatar-img"
                style={{ borderRadius: "50%", border: "2px solid var(--accent-purple)" }}
              >
                <rect width="100" height="100" fill="#7c3aed" />
                <circle cx="50" cy="38" r="18" fill="#ffffff" />
                <path
                  d="M20 85 C20 62, 35 55, 50 55 C65 55, 80 62, 80 85 Z"
                  fill="#ffffff"
                />
              </svg>

              <div className="profile-text d-none d-sm-block">
                <span className="profile-name">Administrator</span>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT OUTLET */}
        <main className="content-outlet">
          <Outlet />
        </main>

        {/* LAYOUT FOOTER */}
        <footer className="main-footer">
          <div className="footer-copyright">
            © 2026 EduMaster Portal. All rights reserved.
          </div>
          <div className="footer-links">
            <a href="#support">Support</a>
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;