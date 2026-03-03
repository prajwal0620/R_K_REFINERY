import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import BillingPage from "./pages/BillingPage.jsx";
import ReportsPage from "./pages/ReportsPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import Layout from "./components/layout/Layout.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

function App() {
  return (
    <Routes>
      {/* Root par hi LoginPage */}
      <Route path="/" element={<LoginPage />} />

      {/* Agar koi /login type kare to bhi login hi dikhao */}
      <Route path="/login" element={<Navigate to="/" replace />} />

      {/* Protected area */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Route>
      </Route>

      {/* Not found */}
      <Route path="/404" element={<NotFoundPage />} />
      {/* Baaki sab ko root (login) pe bhej do */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;