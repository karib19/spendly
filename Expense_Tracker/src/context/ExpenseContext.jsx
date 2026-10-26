
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import api from "../api/client";

const ExpenseContext = createContext();

const defaultCategories = {
  expense: [
    "Food",
    "Transport",
    "Shopping",
    "Bills",
    "Entertainment",
    "Healthcare",
    "Education",
    "Housing",
    "Other Expense",
  ],
  income: [
    "Salary",
    "Freelance",
    "Business",
    "Investment",
    "Other Income",
  ],
};

const defaultSettings = {
  currency: "BDT",
  theme: "light",
};

const supportedTransactionTypes = ["income", "expense"];
const supportedCurrencies = ["BDT", "USD", "EUR", "GBP", "INR"];
const supportedThemes = ["light", "dark"];

function cloneData(data) {
  return JSON.parse(JSON.stringify(data));
}

function getStoredData(key, fallback) {
  try {
    const savedData = localStorage.getItem(key);

    if (!savedData) {
      return cloneData(fallback);
    }

    return JSON.parse(savedData);
  } catch {
    return cloneData(fallback);
  }
}

function getApiResults(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.results)) {
    return data.results;
  }

  throw new Error("Unexpected API response.");
}

function getCurrentMonth() {
  const now = new Date();

  return `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}-01`;
}

function normalizeBudgetMonth(value) {
  if (!value) {
    return getCurrentMonth();
  }

  const monthString = String(value).trim();

  // Accept YYYY-MM or YYYY-MM-DD and normalize to the first day.
  const match = monthString.match(/^(\d{4})-(\d{2})(?:-\d{2})?$/);

  if (!match) {
    throw new Error("Invalid budget month.");
  }

  const year = Number(match[1]);
  const month = Number(match[2]);

  if (month < 1 || month > 12) {
    throw new Error("Invalid budget month.");
  }

  return `${year}-${String(month).padStart(2, "0")}-01`;
}

// Convert backend payment method to the frontend label.
function normalizePaymentMethod(method) {
  const methods = {
    cash: "Cash",
    card: "Card",
    bank: "Bank",
    mobile_banking: "Mobile Banking",
    other: "Other",
  };

  return methods[String(method || "cash").toLowerCase()] || "Cash";
}

// Convert Django transaction to frontend format.
function toFrontendTransaction(item) {
  return {
    id: item.id,
    type: item.transaction_type,
    title: item.title,
    amount: Number(item.amount),
    category: item.category,
    date: item.date,
    paymentMethod: normalizePaymentMethod(item.payment_method),
    note: item.description || "",
  };
}

// Convert frontend transaction to Django fields.
function toBackendTransaction(item) {
  const paymentMethods = {
    cash: "cash",
    card: "card",
    bank: "bank",
    "bank transfer": "bank",
    mobile_banking: "mobile_banking",
    "mobile banking": "mobile_banking",
    other: "other",
  };

  const method = String(item.paymentMethod || "Cash")
    .trim()
    .toLowerCase();

  return {
    title: String(item.title || "").trim(),
    amount: String(item.amount),
    transaction_type: item.type,
    category: String(item.category || "").trim(),
    payment_method: paymentMethods[method] || "cash",
    date: item.date,
    description: String(item.note || "").trim(),
  };
}

// Convert Django budget to frontend format.
function toFrontendBudget(item) {
  return {
    id: item.id,
    category: item.category,
    amount: Number(item.amount),
    month: item.month,
  };
}

// Convert frontend budget to Django fields.
function toBackendBudget(item) {
  const amount = Number(item.amount);
  const category = String(item.category || "").trim();

  if (!category) {
    throw new Error("Please select a budget category.");
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Budget amount must be greater than zero.");
  }

  return {
    category,
    amount: String(amount),
    month: normalizeBudgetMonth(item.month),
  };
}

function isValidTransaction(transaction) {
  if (!transaction || typeof transaction !== "object") {
    return false;
  }

  return (
    transaction.id !== undefined &&
    transaction.id !== null &&
    supportedTransactionTypes.includes(transaction.type) &&
    typeof transaction.title === "string" &&
    transaction.title.trim() !== "" &&
    Number.isFinite(Number(transaction.amount)) &&
    Number(transaction.amount) > 0 &&
    typeof transaction.category === "string" &&
    transaction.category.trim() !== "" &&
    typeof transaction.date === "string" &&
    typeof transaction.paymentMethod === "string"
  );
}

function isValidBudget(budget) {
  if (!budget || typeof budget !== "object") {
    return false;
  }

  return (
    typeof budget.category === "string" &&
    budget.category.trim() !== "" &&
    Number.isFinite(Number(budget.amount)) &&
    Number(budget.amount) > 0
  );
}

function isValidCategories(categories) {
  return (
    categories &&
    typeof categories === "object" &&
    Array.isArray(categories.expense) &&
    Array.isArray(categories.income) &&
    categories.expense.every(
      (category) =>
        typeof category === "string" && category.trim() !== ""
    ) &&
    categories.income.every(
      (category) =>
        typeof category === "string" && category.trim() !== ""
    )
  );
}

function isValidSettings(settings) {
  if (!settings || typeof settings !== "object") {
    return false;
  }

  if (
    settings.currency !== undefined &&
    !supportedCurrencies.includes(settings.currency)
  ) {
    return false;
  }

  if (
    settings.theme !== undefined &&
    !supportedThemes.includes(settings.theme)
  ) {
    return false;
  }

  return true;
}

export function ExpenseProvider({ children }) {
  const location = useLocation();

  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [transactionsError, setTransactionsError] = useState("");

  const [budgets, setBudgets] = useState([]);
  const [budgetsLoading, setBudgetsLoading] = useState(false);
  const [budgetsError, setBudgetsError] = useState("");

  const [categories, setCategories] = useState(() =>
    getStoredData("spendly_categories", defaultCategories)
  );

  const [settings, setSettings] = useState(() =>
    getStoredData("spendly_settings", defaultSettings)
  );

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register";

  // Load account-specific transactions and budgets.
  useEffect(() => {
    const accessToken = localStorage.getItem("spendly_access");

    if (!accessToken || isAuthPage) {
      setTransactions([]);
      setBudgets([]);

      setTransactionsError("");
      setBudgetsError("");

      setTransactionsLoading(false);
      setBudgetsLoading(false);

      return;
    }

    let cancelled = false;

    async function loadTransactions() {
      setTransactionsLoading(true);
      setTransactionsError("");

      try {
        const response = await api.get("/transactions/");
        const results = getApiResults(response.data);

        if (!cancelled) {
          setTransactions(results.map(toFrontendTransaction));
        }
      } catch (error) {
        if (!cancelled) {
          setTransactions([]);
          setTransactionsError(
            "Unable to load transactions. Please try again."
          );

          console.error("Failed to load transactions:", error);
        }
      } finally {
        if (!cancelled) {
          setTransactionsLoading(false);
        }
      }
    }

    async function loadBudgets() {
      setBudgetsLoading(true);
      setBudgetsError("");

      try {
        const response = await api.get("/budgets/");
        const results = getApiResults(response.data);

        if (!cancelled) {
          setBudgets(results.map(toFrontendBudget));
        }
      } catch (error) {
        if (!cancelled) {
          setBudgets([]);
          setBudgetsError(
            "Unable to load budgets. Please try again."
          );

          console.error("Failed to load budgets:", error);
        }
      } finally {
        if (!cancelled) {
          setBudgetsLoading(false);
        }
      }
    }

    loadTransactions();
    loadBudgets();

    return () => {
      cancelled = true;
    };
  }, [location.pathname, isAuthPage]);

  // Persist only local preferences and custom categories.
  useEffect(() => {
    localStorage.setItem(
      "spendly_categories",
      JSON.stringify(categories)
    );
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(
      "spendly_settings",
      JSON.stringify(settings)
    );
  }, [settings]);

  // ---------------- Transactions API ----------------

  const addTransaction = async (transaction) => {
    const payload = toBackendTransaction(transaction);

    try {
      const response = await api.post("/transactions/", payload);
      const newTransaction = toFrontendTransaction(response.data);

      setTransactions((current) => [
        newTransaction,
        ...current.filter(
          (item) => String(item.id) !== String(newTransaction.id)
        ),
      ]);

      return newTransaction;
    } catch (error) {
      console.error("Failed to create transaction:", error);
      throw error;
    }
  };

  const updateTransaction = async (id, updatedData) => {
    const existing = transactions.find(
      (transaction) => String(transaction.id) === String(id)
    );

    if (!existing) {
      throw new Error("Transaction not found.");
    }

    const payload = toBackendTransaction({
      ...existing,
      ...updatedData,
    });

    try {
      const response = await api.patch(
        `/transactions/${id}/`,
        payload
      );

      const updatedTransaction = toFrontendTransaction(response.data);

      setTransactions((current) =>
        current.map((transaction) =>
          String(transaction.id) === String(id)
            ? updatedTransaction
            : transaction
        )
      );

      return updatedTransaction;
    } catch (error) {
      console.error("Failed to update transaction:", error);
      throw error;
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await api.delete(`/transactions/${id}/`);

      setTransactions((current) =>
        current.filter(
          (transaction) => String(transaction.id) !== String(id)
        )
      );
    } catch (error) {
      console.error("Failed to delete transaction:", error);
      throw error;
    }
  };

  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce(
      (total, transaction) => total + Number(transaction.amount || 0),
      0
    );

  const totalExpense = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce(
      (total, transaction) => total + Number(transaction.amount || 0),
      0
    );

  const balance = totalIncome - totalExpense;

  // ---------------- Budgets API ----------------

  const addBudget = async (budget) => {
    const payload = toBackendBudget({
      ...budget,
      month: budget.month || getCurrentMonth(),
    });

    try {
      const response = await api.post("/budgets/", payload);
      const newBudget = toFrontendBudget(response.data);

      setBudgets((current) => {
        const withoutDuplicate = current.filter(
          (item) => String(item.id) !== String(newBudget.id)
        );

        return [...withoutDuplicate, newBudget];
      });

      return newBudget;
    } catch (error) {
      console.error("Failed to create budget:", error);
      throw error;
    }
  };

  const updateBudget = async (id, updatedData) => {
    const existing = budgets.find(
      (budget) => String(budget.id) === String(id)
    );

    if (!existing) {
      throw new Error("Budget not found.");
    }

    const payload = toBackendBudget({
      ...existing,
      ...updatedData,
    });

    try {
      const response = await api.patch(`/budgets/${id}/`, payload);
      const updatedBudget = toFrontendBudget(response.data);

      setBudgets((current) =>
        current.map((budget) =>
          String(budget.id) === String(id)
            ? updatedBudget
            : budget
        )
      );

      return updatedBudget;
    } catch (error) {
      console.error("Failed to update budget:", error);
      throw error;
    }
  };

  const deleteBudget = async (id) => {
    try {
      await api.delete(`/budgets/${id}/`);

      setBudgets((current) =>
        current.filter(
          (budget) => String(budget.id) !== String(id)
        )
      );
    } catch (error) {
      console.error("Failed to delete budget:", error);
      throw error;
    }
  };

  // ---------------- Categories ----------------

  const addCategory = (type, categoryName) => {
    if (type !== "expense" && type !== "income") return false;
    if (typeof categoryName !== "string") return false;

    const normalizedName = categoryName.trim();
    if (!normalizedName) return false;

    const exists = categories[type].some(
      (category) =>
        category.toLowerCase() === normalizedName.toLowerCase()
    );

    if (exists) return false;

    setCategories((current) => ({
      ...current,
      [type]: [...current[type], normalizedName],
    }));

    return true;
  };

  const deleteCategory = (type, categoryName) => {
    if (type !== "expense" && type !== "income") return false;

    setCategories((current) => ({
      ...current,
      [type]: current[type].filter(
        (category) => category !== categoryName
      ),
    }));

    return true;
  };

  // ---------------- Settings ----------------

  const updateSettings = (updatedSettings) => {
    setSettings((current) => {
      const nextSettings = {
        ...current,
        ...updatedSettings,
      };

      if (!supportedCurrencies.includes(nextSettings.currency)) {
        nextSettings.currency = defaultSettings.currency;
      }

      if (!supportedThemes.includes(nextSettings.theme)) {
        nextSettings.theme = defaultSettings.theme;
      }

      return nextSettings;
    });
  };


  // Delete server data while keeping frontend state
  // consistent if some requests fail.
  const resetAllData = async () => {
    const transactionSnapshot = [...transactions];
    const budgetSnapshot = [...budgets];

    const requests = [
      ...transactionSnapshot.map((transaction) => ({
        type: "transaction",
        id: transaction.id,
        promise: api.delete(
          `/transactions/${transaction.id}/`
        ),
      })),
      ...budgetSnapshot.map((budget) => ({
        type: "budget",
        id: budget.id,
        promise: api.delete(`/budgets/${budget.id}/`),
      })),
    ];

    const results = await Promise.allSettled(
      requests.map((request) => request.promise)
    );

    const deletedTransactionIds = new Set();
    const deletedBudgetIds = new Set();
    const failedItems = [];

    results.forEach((result, index) => {
      const request = requests[index];

      if (result.status === "fulfilled") {
        if (request.type === "transaction") {
          deletedTransactionIds.add(String(request.id));
        } else {
          deletedBudgetIds.add(String(request.id));
        }
      } else {
        failedItems.push({
          type: request.type,
          id: request.id,
        });

        console.error(
          `Failed to delete ${request.type} ${request.id}:`,
          result.reason
        );
      }
    });

    // Remove only records confirmed as deleted by the API.
    setTransactions((current) =>
      current.filter(
        (transaction) =>
          !deletedTransactionIds.has(String(transaction.id))
      )
    );

    setBudgets((current) =>
      current.filter(
        (budget) =>
          !deletedBudgetIds.has(String(budget.id))
      )
    );

    if (failedItems.length > 0) {
      throw new Error(
        `Could not delete ${failedItems.length} item(s). ` +
          "Some data may still remain. Please try again."
      );
    }

    // Reset local preferences only after all server deletions succeed.
    setCategories(cloneData(defaultCategories));
    setSettings(cloneData(defaultSettings));
  };


  // Import local preferences/categories only.
  // Server-managed transactions and budgets are not silently imported.
  const importData = (data) => {
    if (!data || typeof data !== "object") return false;

    if (
      !Array.isArray(data.transactions) ||
      !data.transactions.every(isValidTransaction)
    ) {
      return false;
    }

    if (
      !Array.isArray(data.budgets) ||
      !data.budgets.every(isValidBudget)
    ) {
      return false;
    }

    if (!isValidCategories(data.categories)) return false;

    if (
      data.settings !== undefined &&
      !isValidSettings(data.settings)
    ) {
      return false;
    }

    if (data.transactions.length > 0 || data.budgets.length > 0) {
      console.warn(
        "Transactions and budgets are server-managed and were not imported."
      );

      return false;
    }

    setCategories({
      expense: [
        ...new Set(
          data.categories.expense.map((category) => category.trim())
        ),
      ],
      income: [
        ...new Set(
          data.categories.income.map((category) => category.trim())
        ),
      ],
    });

    if (data.settings) {
      setSettings({
        ...defaultSettings,
        ...data.settings,
      });
    }

    return true;
  };

  return (
    <ExpenseContext.Provider
      value={{
        transactions,
        transactionsLoading,
        transactionsError,

        addTransaction,
        updateTransaction,
        deleteTransaction,

        totalIncome,
        totalExpense,
        balance,

        budgets,
        budgetsLoading,
        budgetsError,

        addBudget,
        updateBudget,
        deleteBudget,

        categories,
        addCategory,
        deleteCategory,

        settings,
        updateSettings,

        resetAllData,
        importData,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpense() {
  const context = useContext(ExpenseContext);

  if (!context) {
    throw new Error(
      "useExpense must be used inside ExpenseProvider"
    );
  }

  return context;
}
