// src/pages/DashboardPage.jsx
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

  // Backend se data load
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
    todayBillsCountCalc,
    todayWeightCalc,
    allBillsCount,
    recentBills,
  } = useMemo(() => {
    const todayBills = bills.filter((b) => b.billDate === todayStr);

    const todayBillsCountCalc = todayBills.length;
    const todayWeightCalc = todayBills.reduce(
      (sum, b) => sum + (b.totalWeight || 0),
      0
    );

    const sorted = [...bills].sort(
      (a, b) => new Date(b.billDate) - new Date(a.billDate)
    );
    const recentBills = sorted.slice(0, 5);

    return {
      todayBillsCountCalc,
      todayWeightCalc,
      allBillsCount: bills.length,
      recentBills,
    };
  }, [bills, todayStr]);

  // Backend summary validate karein (agar hai to use karo)
  const totalBillsToday =
    todaySummary?.totalBillsToday ?? todayBillsCountCalc;
  const todayWeight =
    todaySummary?.totalWeight ?? todayWeightCalc;

  return (
    <div className="space-y-4">
      {/* Header + CTA */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-base font-semibold text-slate-800">
            Dashboard Overview
          </h1>
          <p className="text-xs text-slate-500">
            Daily silver exchange summary aur monthly trend ek hi jagah.
          </p>
        </div>
        <button
          onClick={() => navigate("/billing")}
          className="inline-flex items-center gap-1 bg-gradient-to-r from-rk-primary to-rk-primaryDark text-xs font-semibold text-slate-900 px-4 py-2 rounded-md shadow-soft hover:from-rk-primaryDark hover:to-rk-primary transition-colors"
        >
          + Add New Bill
        </button>
      </div>

      {/* Stats Row (Amount card removed) */}
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
          label="Total Bills - All Time"
          value={allBillsCount}
          subLabel="System me ab tak ke sabhi bills"
        />
      </div>

      {/* Chart + Recent Bills */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart */}
        <div className="lg:col-span-2">
          <SalesChart bills={bills} />
        </div>

        {/* Recent Bills */}
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-semibold text-slate-700">
              Recent Bills
            </div>
            <div className="text-[11px] text-slate-500">
              Last {recentBills.length} records
            </div>
          </div>
          <div className="space-y-2 text-xs max-h-64 overflow-auto">
            {recentBills.map((bill) => (
              <div
                key={bill.id}
                className="flex items-center justify-between border-b border-slate-200 pb-1 last:border-0"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-slate-800 text-[11px]">
                    {bill.billNumber || bill.id}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Date: {bill.billDate}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-slate-700">
                    {Number(bill.totalWeight || 0).toFixed(2)} g
                  </div>
                  {/* Agar yahan amount bhi nahi chahiye to ye line hata sakte ho */}
                  {/* <div className="text-[11px] text-slate-500">
                    ₹{Number(bill.totalAmount || 0).toLocaleString("en-IN")}
                  </div> */}
                </div>
              </div>
            ))}
            {!recentBills.length && (
              <div className="text-[11px] text-slate-500 text-center py-6">
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