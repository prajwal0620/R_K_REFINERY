import { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const SalesChart = ({ bills }) => {
  const { labels, dataPoints } = useMemo(() => {
    const map = new Map();
    bills.forEach((bill) => {
      if (!bill.billDate) return;
      const key = bill.billDate.slice(0, 7); // YYYY-MM
      const prev = map.get(key) || 0;
      map.set(key, prev + (bill.totalAmount || 0));
    });

    const sortedKeys = Array.from(map.keys()).sort();
    const labels = sortedKeys.map((k) => {
      const [y, m] = k.split("-");
      const d = new Date(Number(y), Number(m) - 1, 1);
      return d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
    });
    const dataPoints = sortedKeys.map((k) => map.get(k));

    return { labels, dataPoints };
  }, [bills]);

  const data = {
    labels,
    datasets: [
      {
        label: "Monthly Sales (₹)",
        data: dataPoints,
        borderColor: "#0ea5e9",
        backgroundColor: "rgba(14,165,233,0.2)",
        tension: 0.25,
        pointRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: "#e5e7eb", font: { size: 11 } },
      },
      tooltip: {
        displayColors: false,
        callbacks: {
          label: (ctx) => ` ₹${ctx.parsed.y.toLocaleString("en-IN")}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#9ca3af", font: { size: 10 } },
        grid: { display: false },
      },
      y: {
        ticks: {
          color: "#9ca3af",
          font: { size: 10 },
          callback: (val) => `₹${val / 1000}k`,
        },
        grid: { color: "rgba(55,65,81,0.4)" },
      },
    },
  };

  return (
    <div className="relative bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 h-64 shadow-soft dark:shadow-softDark overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rk-accent to-rk-primary" />
      <div className="flex items-center justify-between mb-2 mt-1">
        <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Monthly Sales Overview
        </div>
        <div className="text-[11px] text-slate-500 dark:text-slate-500">
          Data from backend
        </div>
      </div>
      {labels.length === 0 ? (
        <div className="flex items-center justify-center h-full text-xs text-slate-500 dark:text-slate-500">
          No data
        </div>
      ) : (
        <Line data={data} options={options} />
      )}
    </div>
  );
};

export default SalesChart;