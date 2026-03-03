import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";

const Layout = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true }); // logout ke baad login page (root)
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Billing", path: "/billing" },
    { name: "Reports", path: "/reports" },
  ];

  const currentTitle =
    location.pathname === "/dashboard"
      ? "Dashboard"
      : location.pathname === "/billing"
      ? "Billing"
      : location.pathname === "/reports"
      ? "Reports"
      : "";

  return (
    <div className="h-screen flex bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-rk-primaryDark via-slate-900 to-slate-950 border-r border-slate-900 flex flex-col shadow-softDark">
        <div className="px-4 py-4 border-b border-slate-800">
          <div className="text-[11px] tracking-[0.18em] uppercase text-slate-200">
            R.K. REFINERY
          </div>
          <div className="text-lg font-semibold text-white">
            Silver Exchange
          </div>
          <div className="mt-1 text-[11px] text-slate-300 leading-snug">
            Mangal Katta Complex, Shroff Bazar, Adoni
          </div>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                [
                  "block px-3 py-2 rounded-md text-sm font-medium transition-all",
                  isActive
                    ? "bg-gradient-to-r from-rk-primary to-rk-accent text-slate-900 shadow-soft"
                    : "text-slate-200 hover:bg-slate-800/70 hover:text-white",
                ].join(" ")
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-slate-800 text-xs text-slate-300">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-[11px]">Logged in as</div>
              <div className="font-semibold text-slate-50">
                {user?.username}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-center text-xs text-red-300 hover:text-white border border-red-500/60 hover:border-red-400 rounded-md py-1 transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-14 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 bg-gradient-to-r from-white via-rk-accentSoft to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 shadow-soft dark:shadow-softDark">
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500">
              Billing Management
            </div>
            <div className="text-sm font-semibold text-slate-900 dark:text-silver">
              {currentTitle}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-[11px] text-slate-600 dark:text-slate-400">
              React • Spring Boot • JWT
            </div>
            <button
              onClick={toggleTheme}
              className="text-[11px] px-2.5 py-1 rounded-full border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm"
            >
              {isDark ? "☀ Light Theme" : "🌙 Dark Theme"}
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto px-4 py-4 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;