import { useEffect, useState } from "react";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { clearUserSession } from "../utils/session";

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const userName =
    localStorage.getItem("vivaMateUserName") || "Muhammad Farman";

  const userEmail =
    localStorage.getItem("vivaMateUserEmail") ||
    "student@vivamate.ai";

  const initials = userName
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    const savedTheme = localStorage.getItem("vivaMateTheme");

    if (savedTheme === "dark") {
      setDarkMode(true);
      document.body.classList.add("dark-theme");
    }
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
    setShowNotifications(false);
    setShowProfileMenu(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest(".notification-wrapper")) {
        setShowNotifications(false);
      }

      if (!event.target.closest(".profile-wrapper")) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const toggleTheme = () => {
    const nextMode = !darkMode;

    setDarkMode(nextMode);

    if (nextMode) {
      document.body.classList.add("dark-theme");
      localStorage.setItem("vivaMateTheme", "dark");
    } else {
      document.body.classList.remove("dark-theme");
      localStorage.setItem("vivaMateTheme", "light");
    }
  };

  const logout = () => {
    const shouldLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!shouldLogout) return;

    clearUserSession();
    setShowProfileMenu(false);
    setShowNotifications(false);
    navigate("/login", { replace: true });
  };

  const handleSearch = (event) => {
    event.preventDefault();

    const value = search.trim().toLowerCase();

    if (!value) return;

    if (value.includes("dashboard") || value.includes("overview")) {
      navigate("/dashboard");
    } else if (value.includes("course")) {
      navigate("/courses");
    } else if (
      value.includes("document") ||
      value.includes("notes") ||
      value.includes("study workspace")
    ) {
      navigate("/documents");
    } else if (
      value.includes("task") ||
      value.includes("assignment")
    ) {
      navigate("/tasks");
    } else if (
      value.includes("quiz") ||
      value.includes("test")
    ) {
      navigate("/quizzes");
    } else if (
      value.includes("assistant") ||
      value.includes("ai")
    ) {
      navigate("/assistant");
    } else if (
      value.includes("profile") ||
      value.includes("account")
    ) {
      navigate("/profile");
    } else {
      window.alert(
        "No matching page found. Try dashboard, courses, documents, tasks, quizzes, assistant, or profile."
      );
    }

    setSearch("");
  };

  const navigationItems = [
    {
      name: "Overview",
      path: "/dashboard",
      icon: "▦",
    },
    {
      name: "My Courses",
      path: "/courses",
      icon: "▤",
    },
    {
      name: "My Documents",
      path: "/documents",
      icon: "▣",
    },
    {
      name: "My Tasks",
      path: "/tasks",
      icon: "✓",
    },
    {
      name: "Quizzes",
      path: "/quizzes",
      icon: "✎",
    },
    {
      name: "AI Assistant",
      path: "/assistant",
      icon: "✦",
    },
  ];

  const accountItems = [
    {
      name: "My Profile",
      path: "/profile",
      icon: "♙",
    },
  ];

  const getPageTitle = () => {
    const titles = {
      "/dashboard": "Dashboard",
      "/courses": "My Courses",
      "/documents": "My Documents",
      "/tasks": "My Tasks",
      "/quizzes": "Quizzes",
      "/assistant": "AI Assistant",
      "/profile": "My Profile",
    };

    return titles[location.pathname] || "VivaMate AI";
  };

  return (
    <div className="app-layout">
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`app-sidebar ${
          sidebarOpen ? "app-sidebar-open" : ""
        }`}
      >
        <div className="sidebar-brand">
          <NavLink to="/dashboard" className="brand-link">
            <div className="brand-symbol">V</div>

            <div className="brand-details">
              <strong>
                Viva<span>Mate</span>
              </strong>
              <small>AI Learning Companion</small>
            </div>
          </NavLink>

          <button
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
          >
            ×
          </button>
        </div>

        <div className="sidebar-user">
          <div className="sidebar-avatar">{initials}</div>

          <div className="sidebar-user-details">
            <strong>{userName}</strong>
            <span>Student Account</span>
          </div>

          <span className="online-indicator" />
        </div>

        <nav className="sidebar-nav">
          <p className="nav-section-title">MAIN MENU</p>

          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-nav-link ${isActive ? "active" : ""}`
              }
            >
              <span className="nav-link-icon">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}

          <p className="nav-section-title account-title">
            ACCOUNT
          </p>

          {accountItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-nav-link ${isActive ? "active" : ""}`
              }
            >
              <span className="nav-link-icon">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-promo">
            <div className="promo-icon">✦</div>
            <strong>Learn smarter</strong>
            <p>
              Use VivaMate AI to organize your academic journey.
            </p>
            <button onClick={() => navigate("/assistant")}>
              Ask AI Assistant
            </button>
          </div>

          <button className="sidebar-logout" onClick={logout}>
            <span>↪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="app-main">
        <header className="app-topbar">
          <div className="topbar-heading">
            <button
              className="mobile-menu-button"
              onClick={() => setSidebarOpen(true)}
            >
              <span />
              <span />
              <span />
            </button>

            <div>
              <p>
                Welcome back, {userName.split(" ")[0]} 👋
              </p>
              <h1>{getPageTitle()}</h1>
            </div>
          </div>

          <div className="topbar-actions">
            <form
              className="topbar-search"
              onSubmit={handleSearch}
            >
              <span>⌕</span>
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search anything..."
              />
              <kbd>⌘ K</kbd>
            </form>

            <button
              className="topbar-action-button"
              onClick={toggleTheme}
              title="Toggle theme"
            >
              {darkMode ? "☀" : "☾"}
            </button>

            <div className="notification-wrapper">
              <button
                className="topbar-action-button notification-button"
                onClick={(event) => {
                  event.stopPropagation();
                  setShowNotifications((previous) => !previous);
                  setShowProfileMenu(false);
                }}
                title="Notifications"
              >
                ♧
                <i />
              </button>

              {showNotifications && (
                <div className="dropdown notification-dropdown">
                  <div className="dropdown-heading">
                    <div>
                      <strong>Notifications</strong>
                      <span>3 recent updates</span>
                    </div>
                    <button
                      onClick={() => setShowNotifications(false)}
                    >
                      Clear
                    </button>
                  </div>

                  <div className="notification-row">
                    <div className="notification-icon blue">
                      ✓
                    </div>
                    <div>
                      <strong>Task completed</strong>
                      <p>Your task was updated successfully.</p>
                      <small>Just now</small>
                    </div>
                  </div>

                  <div className="notification-row">
                    <div className="notification-icon purple">
                      ✦
                    </div>
                    <div>
                      <strong>AI Assistant ready</strong>
                      <p>Ask questions and improve your learning.</p>
                      <small>10 minutes ago</small>
                    </div>
                  </div>

                  <div className="notification-row">
                    <div className="notification-icon green">
                      ◷
                    </div>
                    <div>
                      <strong>Study reminder</strong>
                      <p>Your planned study session is waiting.</p>
                      <small>1 hour ago</small>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="profile-wrapper">
              <button
                className="topbar-profile"
                onClick={(event) => {
                  event.stopPropagation();
                  setShowProfileMenu((previous) => !previous);
                  setShowNotifications(false);
                }}
              >
                <div className="topbar-avatar">{initials}</div>

                <div className="topbar-user-text">
                  <strong>{userName}</strong>
                  <span>Student</span>
                </div>

                <span className="profile-arrow">⌄</span>
              </button>

              {showProfileMenu && (
                <div className="dropdown profile-dropdown">
                  <div className="profile-dropdown-user">
                    <div className="topbar-avatar">{initials}</div>
                    <div>
                      <strong>{userName}</strong>
                      <span>{userEmail}</span>
                    </div>
                  </div>

                  <div className="dropdown-divider" />

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate("/profile");
                    }}
                  >
                    <span>♙</span>
                    My Profile
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate("/assistant");
                    }}
                  >
                    <span>✦</span>
                    Open AI Assistant
                  </button>

                  <div className="dropdown-divider" />

                  <button className="danger-action" onClick={logout}>
                    <span>↪</span>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="app-page-content">
          <Outlet />
        </main>

        <footer className="app-footer">
          <span>
            © {new Date().getFullYear()} VivaMate AI
          </span>
          <span>Built for smarter learning • Version 1.0.0</span>
        </footer>
      </div>
    </div>
  );
}

export default Layout;