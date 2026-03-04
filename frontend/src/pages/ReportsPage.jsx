import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useData } from "../context/DataContext.jsx";
import api from "../utils/api.js";

// Shop header (print + WhatsApp ke liye)
const SHOP_INFO_LINES = [
  "R.K.REFINERY Silver Exchange",
  "Mangal Katta Complex, 1st Floor, Shop No. 6 & 7, Shorff Bazar, ADONI",
  "518 301, Kurnool dist",
  "Prop: Anil   |   Mob: 9615889191, 7033654242",
];

// Thermal style print helper (Total Weight + Total Purity included)
const openPrintForBill = (bill) => {
  if (!bill) return;

  const shopHeaderHtml = SHOP_INFO_LINES.map(
    (line) => `<div>${line}</div>`
  ).join("");

  const items = bill.items || [];
  const totalWeight = items.reduce(
    (sum, it) => sum + (Number(it.weight) || 0),
    0
  );
  const totalPurity = items.reduce(
    (sum, it) => sum + (Number(it.purity) || 0),
    0
  );

  const itemsRows =
    items.length > 0
      ? items
          .map(
            (it, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td>${it.description || ""}</td>
        <td style="text-align:right;">${Number(it.weight || 0).toFixed(
          2
        )}</td>
        <td style="text-align:right;">${Number(it.touch || 0).toFixed(
          2
        )}</td>
        <td style="text-align:right;">${Number(it.purity || 0).toFixed(
          2
        )}</td>
      </tr>
    `
          )
          .join("")
      : `<tr><td colspan="5">No items</td></tr>`;

  const html = `
<html>
<head>
  <title>${bill.billNumber || bill.id || "Bill"}</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: Arial, sans-serif; font-size: 11px; margin: 0; padding: 0; }
    .receipt { width: 58mm; margin: 0 auto; padding: 4px; }
    .center { text-align: center; }
    .small { font-size: 10px; }
    hr { border: none; border-top: 1px dashed #000; margin: 4px 0; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 2px 0; }
    th { border-bottom: 1px dashed #000; font-size: 10px; text-align: left; }
    .totals { border-top: 1px dashed #000; margin-top: 4px; padding-top: 4px; }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="center small">
      ${shopHeaderHtml}
    </div>
    <hr />
    <div class="small">
      <div>Bill No: ${bill.billNumber || bill.id || "-"}</div>
      <div>Date: ${bill.billDate || ""}</div>
      <div>Name: ${bill.customerName || "-"}</div>
      <div>Mobile: ${bill.mobile || "-"}</div>
    </div>
    <hr />
    <table class="small">
      <thead>
        <tr>
          <th style="width: 8%;">#</th>
          <th style="width: 42%;">Item</th>
          <th style="width: 16%; text-align:right;">Wt</th>
          <th style="width: 16%; text-align:right;">Tch</th>
          <th style="width: 18%; text-align:right;">Pur</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRows}
      </tbody>
    </table>
    <div class="small totals">
      <div>Total Weight: <strong>${totalWeight.toFixed(2)} g</strong></div>
      <div>Total Purity: <strong>${totalPurity.toFixed(2)} g</strong></div>
    </div>
    <div class="center small" style="margin-top:6px;">
      Thank You Visit Again
    </div>
  </div>
  <script>
    window.onload = function() {
      window.print();
      setTimeout(function() { window.close(); }, 300);
    };
  </script>
</body>
</html>
  `;

  const printWin = window.open("", "_blank", "width=400,height=700");
  if (!printWin) {
    Swal.fire({
      icon: "info",
      title: "Pop‑up Blocked",
      text: "Print ke liye browser me pop‑ups allow karein.",
    });
    return;
  }
  printWin.document.open();
  printWin.document.write(html);
  printWin.document.close();
};

const ReportsPage = () => {
  const { bills, billsLoaded, loadAllBills } = useData();

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchMobile, setSearchMobile] = useState("");
  const [selectedBill, setSelectedBill] = useState(null);
  const [selectedLoading, setSelectedLoading] = useState(false);

  useEffect(() => {
    if (!billsLoaded) {
      loadAllBills();
    }
  }, [billsLoaded, loadAllBills]);

  const filteredBills = useMemo(
    () =>
      bills.filter((bill) => {
        if (fromDate && bill.billDate < fromDate) return false;
        if (toDate && bill.billDate > toDate) return false;

        if (
          searchName &&
          !(bill.customerName || "")
            .toLowerCase()
            .includes(searchName.trim().toLowerCase())
        ) {
          return false;
        }

        if (
          searchMobile &&
          !(bill.mobile || "").includes(searchMobile.trim())
        ) {
          return false;
        }

        return true;
      }),
    [bills, fromDate, toDate, searchName, searchMobile]
  );

  const totals = useMemo(
    () =>
      filteredBills.reduce(
        (acc, bill) => {
          acc.totalWeight += bill.totalWeight || 0;
          acc.totalPurity += bill.totalPurity || 0;
          return acc;
        },
        { totalWeight: 0, totalPurity: 0 }
      ),
    [filteredBills]
  );

  // Excel: sare filtered bills + last row me totals
  const handleExportExcel = () => {
    if (!filteredBills.length) {
      Swal.fire({
        icon: "info",
        title: "No Data",
        text: "Export karne ke liye koi bill nahi mil raha.",
      });
      return;
    }

    const header = [
      "Bill No",
      "Date",
      "Customer Name",
      "Mobile",
      "Total Weight (g)",
      "Total Purity (g)",
    ];
    const rows = filteredBills.map((b, idx) => [
      b.billNumber || b.id,
      b.billDate,
      b.customerName,
      b.mobile,
      Number(b.totalWeight || 0).toFixed(2),
      Number(b.totalPurity || 0).toFixed(2),
    ]);

    // Totals row
    rows.push([
      "",
      "",
      "TOTAL",
      "",
      totals.totalWeight.toFixed(2),
      totals.totalPurity.toFixed(2),
    ]);

    const csvContent = [header, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "rk-refinery-bills.csv";
    a.click();
    URL.revokeObjectURL(url);

    Swal.fire({
      icon: "success",
      title: "Excel Exported",
      text: "Sabhi bills + total summary export ho gaye.",
      timer: 1200,
      showConfirmButton: false,
    });
  };

  // PDF: plain grid, gold header, totals row inside table
  const handleExportPDF = () => {
    if (!filteredBills.length) {
      Swal.fire({
        icon: "info",
        title: "No Data",
        text: "Export karne ke liye koi bill nahi mil raha.",
      });
      return;
    }

    const doc = new jsPDF("p", "pt");
    const pageWidth = doc.internal.pageSize.getWidth();

    // Shop name center, bold
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(SHOP_INFO_LINES[0], pageWidth / 2, 40, { align: "center" });

    // Address center
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    SHOP_INFO_LINES.slice(1).forEach((line, idx) => {
      doc.text(line, pageWidth / 2, 58 + idx * 12, { align: "center" });
    });

    // Report title
    const titleY = 58 + (SHOP_INFO_LINES.length - 1) * 12 + 16;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Bill Report", pageWidth / 2, titleY, { align: "center" });

    const startY = titleY + 10;

    const head = [
      [
        "#",
        "Bill No",
        "Date",
        "Customer",
        "Mobile",
        "Total Wt (g)",
        "Total Purity (g)",
      ],
    ];

    const body = filteredBills.map((b, idx) => [
      idx + 1,
      b.billNumber || b.id,
      b.billDate,
      b.customerName || "",
      b.mobile || "",
      Number(b.totalWeight || 0).toFixed(2),
      Number(b.totalPurity || 0).toFixed(2),
    ]);

    const foot = [
      [
        "",
        "TOTAL",
        "",
        "",
        "",
        totals.totalWeight.toFixed(2),
        totals.totalPurity.toFixed(2),
      ],
    ];

    doc.autoTable({
      head,
      body,
      foot,
      startY,
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 3,
        lineColor: [0, 0, 0], // dark borders
        lineWidth: 0.6,
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: 20,
        fontStyle: "bold",
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: 20,
      },
      footStyles: {
        fillColor: [255, 255, 255],
        textColor: 20,
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 65 },
        2: { cellWidth: 65 },
        3: { cellWidth: 90 },
        4: { cellWidth: 85 },
        5: { cellWidth: 65, halign: "right" },
        6: { cellWidth: 70, halign: "right" },
      },
    });

    doc.save("rk-refinery-bills.pdf");

    Swal.fire({
      icon: "success",
      title: "PDF Exported",
      text: "Sabhi bills + summary PDF me export ho gaye.",
      timer: 1200,
      showConfirmButton: false,
    });
  };

  const loadBillDetails = async (bill) => {
    setSelectedLoading(true);
    try {
      const res = await api.get(`/api/bills/${bill.id}`);
      setSelectedBill(res.data);
    } catch (err) {
      console.error("Error loading bill details", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Bill details load nahi ho paaye.",
      });
    } finally {
      setSelectedLoading(false);
    }
  };

  const sendWhatsAppForBill = (bill) => {
    if (!bill.mobile) {
      Swal.fire({
        icon: "warning",
        title: "No Mobile Number",
        text: "Is bill ke liye mobile number available nahi hai.",
      });
      return;
    }

    const lines = [];

    lines.push(`*${SHOP_INFO_LINES[0]}*`);
    for (let i = 1; i < SHOP_INFO_LINES.length; i++) {
      lines.push(SHOP_INFO_LINES[i]);
    }

    lines.push("");
    lines.push("────────────────────────");
    lines.push("🧾 *Silver Exchange Bill*");
    lines.push(`📄 Bill No: *${bill.billNumber || bill.id}*`);
    lines.push(`📅 Date: *${bill.billDate}*`);
    lines.push(`👤 Customer: *${bill.customerName || "-"}*`);
    lines.push(`📱 Mobile: *${bill.mobile}*`);
    lines.push("────────────────────────");
    lines.push("");
    lines.push("*Items:*");

    (bill.items || []).forEach((i, idx) => {
      lines.push(
        `${idx + 1}) *${i.description || "Item"}*` +
          `\n   • Wt: ${i.weight} g` +
          `\n   • Touch: ${i.touch || 0}%` +
          `\n   • Purity: ${Number(i.purity || 0).toFixed(2)} g`
      );
    });

    lines.push("");
    lines.push("────────────────────────");
    lines.push(
      `✨ *Total Purity:* ${Number(bill.totalPurity || 0).toFixed(2)} g`
    );
    lines.push("🙏 *Thank You, Visit Again*");

    const text = encodeURIComponent(lines.join("\n"));
    const url = `https://wa.me/91${bill.mobile}?text=${text}`;
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-base font-semibold text-slate-800">Reports</h1>
        <p className="text-xs text-slate-500">
          Sabhi bills filter karein, Excel/PDF export karein, aur individual bill
          dekhein / print / WhatsApp karein.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 space-y-3 text-xs shadow-soft">
        <div className="text-xs font-semibold text-slate-700">
          Filters
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-1">
          <div>
            <label className="block text-slate-700 mb-1">Date From</label>
            <input
              type="date"
              className="w-full bg-white border border-slate-300 rounded-md px-2 py-1.5 focus:outline-none focus:border-rk-primary focus:ring-1 focus:ring-rk-primary"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-slate-700 mb-1">Date To</label>
            <input
              type="date"
              className="w-full bg-white border border-slate-300 rounded-md px-2 py-1.5 focus:outline-none focus:border-rk-primary focus:ring-1 focus:ring-rk-primary"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-slate-700 mb-1">
              Customer Name
            </label>
            <input
              type="text"
              className="w-full bg-white border border-slate-300 rounded-md px-2 py-1.5 focus:outline-none focus:border-rk-primary focus:ring-1 focus:ring-rk-primary"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Search name"
            />
          </div>
          <div>
            <label className="block text-slate-700 mb-1">
              Mobile Number
            </label>
            <input
              type="text"
              className="w-full bg-white border border-slate-300 rounded-md px-2 py-1.5 focus:outline-none focus:border-rk-primary focus:ring-1 focus:ring-rk-primary"
              value={searchMobile}
              onChange={(e) => setSearchMobile(e.target.value)}
              placeholder="Search mobile"
            />
          </div>
        </div>
      </div>

      {/* Actions + Totals */}
      <div className="flex flex-wrap justify-between items-center gap-2 text-xs">
        <div className="flex gap-2">
          <button
            onClick={handleExportExcel}
            className="border border-slate-300 px-3 py-1.5 rounded-md text-slate-800 hover:bg-slate-100"
          >
            Export Excel (CSV)
          </button>
          <button
            onClick={handleExportPDF}
            className="border border-slate-300 px-3 py-1.5 rounded-md text-slate-800 hover:bg-slate-100"
          >
            Export PDF
          </button>
        </div>
        <div className="text-[11px] text-slate-600 text-right">
          <div>
            Total Bills:{" "}
            <span className="text-slate-900">{filteredBills.length}</span>
          </div>
          <div>
            Total Weight:{" "}
            <span className="text-slate-900">
              {totals.totalWeight.toFixed(2)} g
            </span>
          </div>
          <div>
            Total Purity:{" "}
            <span className="text-slate-900">
              {totals.totalPurity.toFixed(2)} g
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-auto text-xs shadow-soft">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] text-slate-500">
              <th className="py-1.5 px-2 text-left">Bill No</th>
              <th className="py-1.5 px-2 text-left">Date</th>
              <th className="py-1.5 px-2 text-left">Customer</th>
              <th className="py-1.5 px-2 text-left">Mobile</th>
              <th className="py-1.5 px-2 text-right">Total Wt (g)</th>
              <th className="py-1.5 px-2 text-right">Total Purity (g)</th>
              <th className="py-1.5 px-2 text-center">View</th>
            </tr>
          </thead>
          <tbody>
            {filteredBills.map((bill) => (
              <tr
                key={bill.id}
                className="border-b border-slate-200 last:border-0"
              >
                <td className="py-1.5 px-2">{bill.billNumber || bill.id}</td>
                <td className="py-1.5 px-2">{bill.billDate}</td>
                <td className="py-1.5 px-2">{bill.customerName}</td>
                <td className="py-1.5 px-2">{bill.mobile}</td>
                <td className="py-1.5 px-2 text-right">
                  {Number(bill.totalWeight || 0).toFixed(2)}
                </td>
                <td className="py-1.5 px-2 text-right">
                  {Number(bill.totalPurity || 0).toFixed(2)}
                </td>
                <td className="py-1.5 px-2 text-center">
                  <button
                    onClick={() => loadBillDetails(bill)}
                    className="px-2 py-0.5 border border-slate-300 rounded-md text-[11px] hover:bg-slate-100"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
            {filteredBills.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="py-4 px-2 text-center text-[11px] text-slate-500"
                >
                  No bills found for selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bill Detail Modal */}
      {selectedBill && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="relative overflow-hidden bg-white border border-slate-300 rounded-xl w-full max-w-md p-4 text-xs shadow-soft">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rk-primary to-rk-accent" />
            <div className="mt-1 flex justify-between items-center mb-2">
              <div className="font-semibold text-slate-800">
                Bill Details ({selectedBill.billNumber || selectedBill.id})
              </div>
              <button
                onClick={() => setSelectedBill(null)}
                className="text-[11px] text-slate-500 hover:text-slate-900"
              >
                ✕
              </button>
            </div>

            {selectedLoading ? (
              <div className="text-center text-[11px] text-slate-500 py-4">
                Loading...
              </div>
            ) : (
              <>
                <div className="text-[11px] text-slate-700 mb-2">
                  {SHOP_INFO_LINES.map((line) => (
                    <div key={line}>{line}</div>
                  ))}
                </div>

                <div className="text-[11px] text-slate-600 mb-2 space-y-0.5">
                  <div>Bill No: {selectedBill.billNumber || selectedBill.id}</div>
                  <div>Date: {selectedBill.billDate}</div>
                  <div>Customer: {selectedBill.customerName}</div>
                  <div>Mobile: {selectedBill.mobile}</div>
                </div>

                <div className="max-h-40 overflow-auto border border-slate-200 rounded-md mb-2">
                  <table className="w-full text-[11px]">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="px-2 py-1 text-left">#</th>
                        <th className="px-2 py-1 text-left">Item</th>
                        <th className="px-2 py-1 text-right">Wt</th>
                        <th className="px-2 py-1 text-right">Touch</th>
                        <th className="px-2 py-1 text-right">Purity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(selectedBill.items || []).map((i, idx) => (
                        <tr key={idx} className="border-t border-slate-200">
                          <td className="px-2 py-1">{idx + 1}</td>
                          <td className="px-2 py-1">{i.description}</td>
                          <td className="px-2 py-1 text-right">
                            {Number(i.weight || 0).toFixed(2)}
                          </td>
                          <td className="px-2 py-1 text-right">
                            {Number(i.touch || 0).toFixed(2)}
                          </td>
                          <td className="px-2 py-1 text-right">
                            {Number(i.purity || 0).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                      {(!selectedBill.items ||
                        selectedBill.items.length === 0) && (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-2 py-2 text-center text-slate-500"
                          >
                            No items
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="text-[11px] text-slate-700 mb-3">
                  Total Purity:{" "}
                  <span className="font-semibold">
                    {Number(selectedBill.totalPurity || 0).toFixed(2)} g
                  </span>
                </div>

                <div className="flex justify-end gap-2 text-[11px]">
                  <button
                    onClick={() => openPrintForBill(selectedBill)}
                    className="px-3 py-1 border border-slate-300 rounded-md text-slate-800 hover:bg-slate-100"
                  >
                    Print
                  </button>
                  <button
                    onClick={() => sendWhatsAppForBill(selectedBill)}
                    className="px-3 py-1 border border-green-500/60 text-green-700 rounded-md hover:bg-green-50"
                  >
                    WhatsApp
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;