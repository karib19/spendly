
import { Plus, RefreshCw } from "lucide-react";

import { useLanguage } from "../context/LanguageContext";
import { useExpense } from "../context/ExpenseContext";

import SummaryCard from "../components/dashboard/SummaryCard";
import BudgetProgress from "../components/dashboard/BudgetProgress";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import SpendingInsight from "../components/dashboard/SpendingInsight";

function Dashboard({
  onAddTransaction,
  onEditTransaction,
  onDeleteTransaction,
}) {
  const {
    transactions = [],
    transactionsLoading,
    transactionsError,
  } = useExpense();

  const { t, language } = useLanguage();

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthIndex = now.getMonth();

  const currentMonth = now.toLocaleString(
    language === "bn" ? "bn-BD" : "en-US",
    {
      month: "long",
      year: "numeric",
    }
  );

  const getTransactionType = (transaction) =>
    String(
      transaction.type ?? transaction.transaction_type ?? ""
    )
      .trim()
      .toLowerCase();

  const getTransactionMonth = (dateValue) => {
    if (!dateValue) return null;

    const dateString = String(dateValue);
    const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);

    let date;

    if (match) {
      const [, year, month, day] = match;

      date = new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
      );

      if (
        date.getFullYear() !== Number(year) ||
        date.getMonth() !== Number(month) - 1 ||
        date.getDate() !== Number(day)
      ) {
        return null;
      }
    } else {
      date = new Date(dateValue);
    }

    if (Number.isNaN(date.getTime())) return null;

    return {
      year: date.getFullYear(),
      month: date.getMonth(),
    };
  };

  const currentMonthTransactions = transactions.filter(
    (transaction) => {
      const transactionDate = getTransactionMonth(transaction.date);

      return (
        transactionDate &&
        transactionDate.year === currentYear &&
        transactionDate.month === currentMonthIndex
      );
    }
  );

  const totalIncome = currentMonthTransactions
    .filter(
      (transaction) => getTransactionType(transaction) === "income"
    )
    .reduce(
      (total, transaction) =>
        total + Math.max(0, Number(transaction.amount) || 0),
      0
    );

  const totalExpense = currentMonthTransactions
    .filter(
      (transaction) => getTransactionType(transaction) === "expense"
    )
    .reduce(
      (total, transaction) =>
        total + Math.max(0, Number(transaction.amount) || 0),
      0
    );

  const balance = totalIncome - totalExpense;

  const getGreeting = () => {
    const hour = now.getHours();

    if (hour < 12) {
      return t("dashboard.greetingMorning");
    }

    if (hour < 17) {
      return t("dashboard.greetingAfternoon");
    }

    if (hour < 20) {
      return t("dashboard.greetingEvening");
    }

    return t("dashboard.greetingNight");
  };

  return (
    <div>
      {/* Header */}
      <div
        className="
          mb-8 flex flex-col gap-4
          sm:flex-row sm:items-end sm:justify-between
        "
      >
        <div>
          <p
            className="
              mb-1 text-sm font-medium
              text-slate-500 dark:text-slate-400
            "
          >
            {currentMonth}
          </p>

          <h2
            className="
              text-2xl font-bold tracking-tight
              text-slate-900 dark:text-white sm:text-3xl
            "
          >
            {getGreeting()} 👋
          </h2>

          <p
            className="
              mt-2 text-sm
              text-slate-500 dark:text-slate-400
            "
          >
            {t("dashboard.description")}
          </p>
        </div>

        <button
          type="button"
          onClick={onAddTransaction}
          className="
            flex items-center justify-center gap-2
            rounded-xl bg-slate-900 px-4 py-3
            text-sm font-semibold text-white
            transition-all duration-200
            hover:-translate-y-0.5 hover:bg-slate-800
            hover:shadow-md active:translate-y-0
            active:scale-[0.98]
            dark:bg-slate-100 dark:text-slate-900
            dark:hover:bg-white
          "
        >
          <Plus size={18} />
          {t("dashboard.addTransaction")}
        </button>
      </div>

      {/* Backend loading status */}
      {transactionsLoading && (
        <div
          role="status"
          className="
            mb-5 flex items-center gap-2 rounded-xl
            border border-slate-200 bg-white px-4 py-3
            text-sm text-slate-600
            dark:border-slate-800 dark:bg-slate-900
            dark:text-slate-300
          "
        >
          <RefreshCw size={16} className="animate-spin" />
          {language === "bn"
            ? "লেনদেনের তথ্য লোড হচ্ছে..."
            : "Loading your transactions..."}
        </div>
      )}

      {/* Backend error */}
      {!transactionsLoading && transactionsError && (
        <div
          role="alert"
          className="
            mb-5 rounded-xl border border-rose-200
            bg-rose-50 px-4 py-3 text-sm leading-6
            text-rose-700
            dark:border-rose-900 dark:bg-rose-950/40
            dark:text-rose-300
          "
        >
          {transactionsError}
        </div>
      )}

      {/* Current Month Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <SummaryCard type="balance" amount={balance} />
        <SummaryCard type="income" amount={totalIncome} />
        <SummaryCard type="expense" amount={totalExpense} />
      </div>

      {/* Budget + Spending Insight */}
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <BudgetProgress />
        <SpendingInsight />
      </div>

      {/* Recent Transactions */}
      <div className="mt-6">
        <RecentTransactions
          onAddTransaction={onAddTransaction}
          onEditTransaction={onEditTransaction}
          onDeleteTransaction={onDeleteTransaction}
        />
      </div>
    </div>
  );
}

export default Dashboard;
