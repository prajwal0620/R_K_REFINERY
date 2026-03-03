const today = new Date();

const formatDate = (date) => date.toISOString().slice(0, 10);

export const MOCK_CUSTOMERS = [
  { id: 1, name: "Ravi Kumar", mobile: "9876543210" },
  { id: 2, name: "Sita Devi", mobile: "9123456780" },
  { id: 3, name: "Anil Kumar", mobile: "9000011122" },
  { id: 4, name: "Mahesh Rao", mobile: "9988776655" },
];

const calcTotals = (rawItems, ratePerGram) => {
  const items = rawItems.map((item) => {
    const weight = Number(item.weight) || 0;
    const touch = Number(item.touch) || 0;
    const purity = (weight * touch) / 100;
    return { ...item, weight, touch, purity };
  });

  const totalWeight = items.reduce((sum, i) => sum + i.weight, 0);
  const totalPurity = items.reduce((sum, i) => sum + i.purity, 0);
  const totalAmount = Math.round(totalPurity * ratePerGram);

  return { items, totalWeight, totalPurity, totalAmount };
};

const baseRate = 75; // Static demo rate

const rawBills = [
  {
    id: "BILL-0001",
    customerId: 1,
    billDate: formatDate(today),
    ratePerGram: baseRate,
    items: [
      { description: "Silver Chain", weight: 120, touch: 90 },
      { description: "Silver Ring", weight: 40, touch: 92 },
    ],
  },
  {
    id: "BILL-0002",
    customerId: 2,
    billDate: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)),
    ratePerGram: baseRate,
    items: [
      { description: "Silver Anklet", weight: 200, touch: 85 },
    ],
  },
  {
    id: "BILL-0003",
    customerId: 3,
    billDate: formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3)),
    ratePerGram: baseRate,
    items: [
      { description: "Silver Bangles", weight: 150, touch: 88 },
      { description: "Silver Coin", weight: 50, touch: 99 },
    ],
  },
  {
    id: "BILL-0004",
    customerId: 4,
    billDate: formatDate(new Date(today.getFullYear(), today.getMonth() - 1, 10)),
    ratePerGram: baseRate,
    items: [
      { description: "Silver Chain", weight: 100, touch: 90 },
    ],
  },
  {
    id: "BILL-0005",
    customerId: 1,
    billDate: formatDate(new Date(today.getFullYear(), today.getMonth() - 2, 5)),
    ratePerGram: baseRate,
    items: [
      { description: "Silver Ring", weight: 30, touch: 92 },
      { description: "Silver Ring", weight: 32, touch: 91 },
    ],
  },
];

export const MOCK_BILLS = rawBills.map((bill) => {
  const { items, totalWeight, totalPurity, totalAmount } = calcTotals(
    bill.items,
    bill.ratePerGram
  );

  return {
    ...bill,
    items,
    totalWeight,
    totalPurity,
    totalAmount,
    createdAt: new Date().toISOString(),
  };
});