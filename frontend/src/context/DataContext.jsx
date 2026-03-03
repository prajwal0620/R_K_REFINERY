import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import api from "../utils/api.js";

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [bills, setBills] = useState([]);
  const [billsLoading, setBillsLoading] = useState(false);
  const [billsLoaded, setBillsLoaded] = useState(false);

  const [todaySummary, setTodaySummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const loadAllBills = useCallback(async () => {
    setBillsLoading(true);
    try {
      const res = await api.get("/api/bills");
      setBills(res.data || []);
      setBillsLoaded(true);
    } catch (err) {
      console.error("Error loading bills", err);
    } finally {
      setBillsLoading(false);
    }
  }, []);

  const loadTodaySummary = useCallback(async () => {
    setSummaryLoading(true);
    try {
      const res = await api.get("/api/bills/summary/today");
      setTodaySummary(res.data);
    } catch (err) {
      console.error("Error loading today summary", err);
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  const createBill = useCallback(
    async (payload) => {
      const res = await api.post("/api/bills", payload);
      const saved = res.data;
      // add to beginning for "recent bills"
      setBills((prev) => [saved, ...prev]);
      return saved;
    },
    []
  );

  const value = useMemo(
    () => ({
      bills,
      billsLoading,
      billsLoaded,
      todaySummary,
      summaryLoading,
      loadAllBills,
      loadTodaySummary,
      createBill,
      setBills,
    }),
    [
      bills,
      billsLoading,
      billsLoaded,
      todaySummary,
      summaryLoading,
      loadAllBills,
      loadTodaySummary,
      createBill,
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => useContext(DataContext);