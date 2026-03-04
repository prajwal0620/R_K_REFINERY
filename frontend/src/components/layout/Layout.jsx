import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
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
    <div className="h-screen flex bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-soft">
        <div className="px-4 py-4 border-b border-slate-200">
          <div className="text-[11px] tracking-[0.18em] uppercase text-slate-500">
            BILLING MANAGEMENT
          </div>
          <div className="text-lg font-semibold text-slate-900 mt-1">
            R.K. Refinery
          </div>
          <div className="text-[11px] text-slate-500 mt-1 leading-snug">
            Silver Exchange<br />
            Mangal Katta Complex, Shorff Bazar, Adoni
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
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
                ].join(" ")
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-slate-200 text-xs text-slate-600">
          <div>Logged in as:</div>
          <div className="font-semibold text-slate-900">{user?.username}</div>
          <button
            onClick={handleLogout}
            className="mt-3 w-full text-center text-xs text-red-600 hover:text-red-700 border border-red-300 hover:border-red-400 rounded-md py-1 transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-gradient-to-r from-white via-rk-accentSoft to-white shadow-soft">
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
              Billing Management
            </div>
            <div className="text-sm font-semibold text-slate-800">
              {currentTitle}
            </div>
          </div>
          <div className="text-[11px] text-slate-500">
            React • Spring Boot • JWT
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto px-6 py-4 bg-gradient-to-b from-rk-accentSoft via-slate-50 to-slate-50">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;