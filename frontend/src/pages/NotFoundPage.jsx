import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-center text-center px-4">
      <div className="text-3xl font-semibold text-silver mb-2">404</div>
      <div className="text-sm text-slate-700 dark:text-slate-300 mb-1">
        Page Not Found
      </div>
      <div className="text-xs text-slate-500 dark:text-slate-500 mb-4">
        The page you are looking for does not exist.
      </div>
      <Link
        to="/"
        className="text-xs px-3 py-1.5 bg-gradient-to-r from-rk-primary to-rk-accent text-white rounded-md hover:from-rk-primaryDark hover:to-rk-accent"
      >
        Go to Dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;