const StatsCard = ({ label, value, subLabel }) => {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 shadow-soft dark:shadow-softDark">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rk-primary to-rk-accent" />
      <div className="mt-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
        {label}
      </div>
      <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-silver">
        {value}
      </div>
      {subLabel && (
        <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-500">
          {subLabel}
        </div>
      )}
    </div>
  );
};

export default StatsCard;