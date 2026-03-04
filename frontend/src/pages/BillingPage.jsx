import { useState } from "react";
import Swal from "sweetalert2";
import { useData } from "../context/DataContext.jsx";

// Shop header (print + WhatsApp dono ke liye)
const SHOP_INFO_LINES = [
  "R.K.REFINERY Silver Exchange",
  "Mangal Katta Complex, 1st Floor, Shop No. 6 & 7, Shorff Bazar, ADONI",
  "518 301, Kurnool dist",
  "Prop: Anil   |   Mob: 9615889191, 7033654242",
];

const createEmptyItem = () => ({
  id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36),
  description: "",
  weight: "",
  touch: "",
  purity: 0,
});

// Ek bill ko thermal style print karne ka helper
const openPrintForBill = (bill) => {
  if (!bill) return;

  const shopHeaderHtml = SHOP_INFO_LINES.map(
    (line) => `<div>${line}</div>`
  ).join("");

  // Total weight / purity from items (safety)
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

const BillingPage = () => {
  const { createBill } = useData();

  const todayStr = new Date().toISOString().slice(0, 10);

  const [customerName, setCustomerName] = useState("");
  const [mobile, setMobile] = useState("");
  const [date, setDate] = useState(todayStr);
  const [ratePerGram, setRatePerGram] = useState(75); // backend ke liye, UI me nahi dikhate
  const [items, setItems] = useState([createEmptyItem()]);
  const [saving, setSaving] = useState(false);
  const [lastSavedBill, setLastSavedBill] = useState(null);

  const updateItemField = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };

        const weight = Number(
          field === "weight" ? value : updated.weight || 0
        );
        const touch = Number(field === "touch" ? value : updated.touch || 0);
        const purity = (weight * touch) / 100 || 0;
        updated.purity = purity;
        return updated;
      })
    );
  };

  const addItemRow = () => {
    setItems((prev) => [...prev, createEmptyItem()]);
  };

  const removeItemRow = (id) => {
    setItems((prev) =>
      prev.length > 1 ? prev.filter((i) => i.id !== id) : prev
    );
  };

  const totalWeight = items.reduce(
    (sum, i) => sum + (Number(i.weight) || 0),
    0
  );
  const totalPurity = items.reduce(
    (sum, i) => sum + (Number(i.purity) || 0),
    0
  );

  const resetForm = () => {
    setCustomerName("");
    setMobile("");
    setDate(todayStr);
    setRatePerGram(75);
    setItems([createEmptyItem()]);
    // lastSavedBill ko rehne dete hain taaki WhatsApp bhej sake
  };

  const handleSave = async () => {
    if (!customerName.trim() || !mobile.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Missing Details",
        text: "Customer Name aur Mobile required hai.",
      });
      return;
    }
    if (!items.some((i) => Number(i.weight) > 0 && Number(i.touch) > 0)) {
      Swal.fire({
        icon: "warning",
        title: "Items Required",
        text: "Kam se kam ek item ka weight aur touch dalo.",
      });
      return;
    }

    setSaving(true);
    try {
      const cleanedItems = items
        .filter((i) => Number(i.weight) > 0)
        .map((i) => ({
          description: i.description || "Item",
          weight: Number(i.weight),
          touch: Number(i.touch) || 0,
          purity: (Number(i.weight) * (Number(i.touch) || 0)) / 100,
        }));

      const payload = {
        customerName: customerName.trim(),
        mobile: mobile.trim(),
        billDate: date,
        ratePerGram: Number(ratePerGram) || 0,
        items: cleanedItems,
      };

      const savedBill = await createBill(payload);
      setLastSavedBill(savedBill);

      Swal.fire({
        icon: "success",
        title: "Bill Saved",
        text: `Bill No: ${savedBill.billNumber || savedBill.id}`,
        timer: 1500,
        showConfirmButton: false,
      });

      openPrintForBill(savedBill);
      resetForm();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Bill save karte waqt error aaya.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    const cleanedItems = items
      .filter((i) => Number(i.weight) > 0)
      .map((i) => ({
        description: i.description || "Item",
        weight: Number(i.weight),
        touch: Number(i.touch) || 0,
        purity: (Number(i.weight) * (Number(i.touch) || 0)) / 100,
      }));

    if (!cleanedItems.length) {
      Swal.fire({
        icon: "info",
        title: "No Items",
        text: "Print karne ke liye kam se kam ek item add karein.",
      });
      return;
    }

    const tempBill = {
      id: "",
      billNumber: "",
      billDate: date,
      customerName,
      mobile,
      items: cleanedItems,
    };
    openPrintForBill(tempBill);
  };

  const handleWhatsApp = () => {
    if (!mobile.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Mobile Required",
        text: "WhatsApp ke liye customer ka mobile number dalo.",
      });
      return;
    }

    if (
      !lastSavedBill ||
      lastSavedBill.mobile !== mobile.trim() ||
      lastSavedBill.customerName !== customerName.trim()
    ) {
      Swal.fire({
        icon: "info",
        title: "Please Save First",
        text: "Bill Number ke sath WhatsApp bhejne ke liye pehle 'Save + Print' dabaye, phir WhatsApp bheje.",
      });
      return;
    }

    const bill = lastSavedBill;
    const lines = [];

    // Header
    lines.push(`*${SHOP_INFO_LINES[0]}*`);
    for (let i = 1; i < SHOP_INFO_LINES.length; i++) {
      lines.push(SHOP_INFO_LINES[i]);
    }

    lines.push("");
    lines.push("────────────────────────");
    lines.push("🧾 *Silver Exchange Bill*");
    lines.push(`📄 Bill No: *${bill.billNumber || bill.id || "-"}*`);
    lines.push(`📅 Date: *${bill.billDate || date}*`);
    lines.push(`👤 Customer: *${bill.customerName || "-"}*`);
    lines.push(`📱 Mobile: *${bill.mobile || mobile}*`);
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

    // Summary
    const totalW = (bill.items || []).reduce(
      (sum, it) => sum + (Number(it.weight) || 0),
      0
    );
    const totalP = (bill.items || []).reduce(
      (sum, it) => sum + (Number(it.purity) || 0),
      0
    );

    lines.push("");
    lines.push("────────────────────────");
    lines.push(`⚖ *Total Weight:* ${totalW.toFixed(2)} g`);
    lines.push(`✨ *Total Purity:* ${totalP.toFixed(2)} g`);
    lines.push("🙏 *Thank You, Visit Again*");

    const text = encodeURIComponent(lines.join("\n"));
    const url = `https://wa.me/91${bill.mobile}?text=${text}`;
    window.open(url, "_blank");
  };

  const nonEmptyItemsCount = items.filter(
    (i) => Number(i.weight) > 0 || Number(i.touch) > 0
  ).length;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-base font-semibold text-slate-800">
          Billing
        </h1>
        <p className="text-xs text-slate-500">
          Silver exchange bill banaye, automatic weight & purity calculation ke sath.
        </p>
      </div>

      {/* Main Layout: left content, right summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* LEFT: Customer + Items */}
        <div className="lg:col-span-2 space-y-4">
          {/* Customer Details */}
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 space-y-3 shadow-soft">
            <div className="text-xs font-semibold text-slate-700">
              Customer Details
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-slate-700 mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  className="w-full bg-white border border-slate-300 rounded-md px-2 py-1.5 focus:outline-none focus:border-rk-primary focus:ring-1 focus:ring-rk-primary"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Customer Name"
                />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  className="w-full bg-white border border-slate-300 rounded-md px-2 py-1.5 focus:outline-none focus:border-rk-primary focus:ring-1 focus:ring-rk-primary"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="10-digit mobile"
                />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  className="w-full bg-white border border-slate-300 rounded-md px-2 py-1.5 focus:outline-none focus:border-rk-primary focus:ring-1 focus:ring-rk-primary"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 space-y-3 shadow-soft">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-slate-700">
                Items
              </div>
              <button
                onClick={addItemRow}
                className="text-[11px] px-2 py-1 rounded-md border border-slate-300 text-slate-800 hover:bg-slate-100"
              >
                + Add Item
              </button>
            </div>

            <div className="overflow-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] text-slate-500">
                    <th className="py-1 px-2 text-left">Description / Number</th>
                    <th className="py-1 px-2 text-right">Weight (g)</th>
                    <th className="py-1 px-2 text-right">Touch (%)</th>
                    <th className="py-1 px-2 text-right">Purity (g)</th>
                    <th className="py-1 px-2 text-center w-10">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-slate-200 last:border-0"
                    >
                      <td className="py-1.5 px-2">
                        <input
                          type="text"
                          className="w-full bg-white border border-slate-300 rounded-md px-2 py-1 focus:outline-none focus:border-rk-primary focus:ring-1 focus:ring-rk-primary"
                          value={item.description}
                          onChange={(e) =>
                            updateItemField(
                              item.id,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Item / Number"
                        />
                      </td>
                      <td className="py-1.5 px-2 text-right">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className="w-full bg-white border border-slate-300 rounded-md px-2 py-1 text-right focus:outline-none focus:border-rk-primary focus:ring-1 focus:ring-rk-primary"
                          value={item.weight}
                          onChange={(e) =>
                            updateItemField(item.id, "weight", e.target.value)
                          }
                          placeholder="0.00"
                        />
                      </td>
                      <td className="py-1.5 px-2 text-right">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          className="w-full bg-white border border-slate-300 rounded-md px-2 py-1 text-right focus:outline-none focus:border-rk-primary focus:ring-1 focus:ring-rk-primary"
                          value={item.touch}
                          onChange={(e) =>
                            updateItemField(item.id, "touch", e.target.value)
                          }
                          placeholder="0.00"
                        />
                      </td>
                      <td className="py-1.5 px-2 text-right text-slate-800">
                        {Number(item.purity || 0).toFixed(2)}
                      </td>
                      <td className="py-1.5 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => removeItemRow(item.id)}
                          className="text-[11px] text-red-500 hover:text-red-400"
                        >
                          X
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT: Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-soft sticky top-4 space-y-2">
            <div className="text-xs font-semibold text-slate-700 mb-1">
              Bill Summary
            </div>
            <div className="text-[11px] text-slate-600 space-y-1 border-b border-slate-200 pb-2">
              <div>
                <span className="font-semibold">Customer:</span>{" "}
                {customerName || "-"}
              </div>
              <div>
                <span className="font-semibold">Mobile:</span>{" "}
                {mobile || "-"}
              </div>
              <div>
                <span className="font-semibold">Date:</span> {date}
              </div>
            </div>
            <div className="text-[11px] text-slate-600 space-y-1">
              <div>
                <span className="font-semibold">Total Items:</span>{" "}
                {nonEmptyItemsCount}
              </div>
              <div>
                <span className="font-semibold">Total Weight:</span>{" "}
                {totalWeight.toFixed(2)} g
              </div>
              <div>
                <span className="font-semibold">Total Purity:</span>{" "}
                {totalPurity.toFixed(2)} g
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons (bottom) */}
      <div className="flex flex-wrap gap-2 justify-end text-xs pt-2 border-t border-slate-200">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-gradient-to-r from-rk-primary to-rk-accent text-slate-900 px-3 py-1.5 rounded-md font-semibold hover:from-rk-primaryDark hover:to-rk-accent disabled:opacity-70"
        >
          {saving ? "Saving..." : "Save + Print"}
        </button>
        <button
          onClick={handlePrint}
          className="border border-slate-300 px-3 py-1.5 rounded-md text-slate-800 hover:bg-slate-100"
        >
          Only Print
        </button>
        <button
          onClick={handleWhatsApp}
          className="border border-green-500/60 text-green-700 px-3 py-1.5 rounded-md hover:bg-green-50"
        >
          Send on WhatsApp
        </button>
      </div>
    </div>
  );
};

export default BillingPage;