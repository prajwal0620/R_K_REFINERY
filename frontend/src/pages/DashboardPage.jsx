import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext.jsx";
import StatsCard from "../components/dashboard/StatsCard.jsx";
import SalesChart from "../components/dashboard/SalesChart.jsx";

const DashboardPage = () => {
  const {
    bills,
    billsLoaded,
    loadAllBills,
    todaySummary,
    loadTodaySummary,
  } = useData();
  const navigate = useNavigate();

  useEffect(() => {
    if (!billsLoaded) {
      loadAllBills();
    }
    if (!todaySummary) {
      loadTodaySummary();
    }
  }, [billsLoaded, todaySummary, loadAllBills, loadTodaySummary]);

  const todayStr = new Date().toISOString().slice(0, 10);

  const {
    totalBillsTodayCalc,
    todayWeightCalc,
    todayAmountCalc,
    recentBills,
  } = useMemo(() => {
    const todayBills = bills.filter((b) => b.billDate === todayStr);
    const totalBillsTodayCalc = todayBills.length;
    const todayWeightCalc = todayBills.reduce(
      (sum, b) => sum + (b.totalWeight || 0),
      0
    );
    const todayAmountCalc = todayBills.reduce(
      (sum, b) => sum + (b.totalAmount || 0),
      0
    );

    const sorted = [...bills].sort(
      (a, b) => new Date(b.billDate) - new Date(a.billDate)
    );
    const recentBills = sorted.slice(0, 5);

    return { totalBillsTodayCalc, todayWeightCalc, todayAmountCalc, recentBills };
  }, [bills, todayStr]);

  const totalBillsToday =
    todaySummary?.totalBillsToday ?? totalBillsTodayCalc;
  const todayWeight =
    todaySummary?.totalWeight ?? todayWeightCalc;
  const todayAmount =
    todaySummary?.totalAmount ?? todayAmountCalc;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-base font-semibold text-silver">
            Dashboard Overview
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Daily silver exchange summary aur monthly trend ek hi jagah.
          </p>
        </div>
        <button
          onClick={() => navigate("/billing")}
          className="inline-flex items-center gap-1 bg-gradient-to-r from-rk-primary to-rk-accent text-xs font-semibold text-white px-3 py-1.5 rounded-md hover:from-rk-primaryDark hover:to-rk-accent transition-colors"
        >
          + Add New Bill
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatsCard
          label="Total Bills - Today"
          value={totalBillsToday}
          subLabel="Aaj banaye gaye bills"
        />
        <StatsCard
          label="Today Total Weight (g)"
          value={`${todayWeight.toFixed(2)} g`}
          subLabel="Aaj ka total weight"
        />
        <StatsCard
          label="Today Total Amount (₹)"
          value={`₹${todayAmount.toLocaleString("en-IN")}`}
          subLabel="Static rate per gram ke hisaab se"
        />
      </div>

      {/* Middle row: Chart + Recent Bills */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <SalesChart bills={bills} />
        </div>

        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 shadow-soft dark:shadow-softDark">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Recent Bills
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-500">
              Last {recentBills.length} records
            </div>
          </div>
          <div className="space-y-2 text-xs max-h-64 overflow-auto">
            {recentBills.map((bill) => (
              <div
                key={bill.id}
                className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-1 last:border-0"
              >
                <div>
                  <div className="font-medium text-slate-800 dark:text-silver text-[11px]">
                    {bill.billNumber || bill.id}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Date: {bill.billDate}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-slate-700 dark:text-slate-300">
                    {Number(bill.totalWeight || 0).toFixed(2)} g
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    ₹{Number(bill.totalAmount || 0).toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
            ))}
            {recentBills.length === 0 && (
              <div className="text-[11px] text-slate-500 dark:text-slate-500 text-center py-6">
                No bills yet. Create a new bill from Billing page.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;