import {
  Lightbulb,
  TrendingDown,
  TrendingUp,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import { useExpense } from "../../context/ExpenseContext";
import { useLanguage } from "../../context/LanguageContext";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatNumber } from "../../utils/formatNumber";

function SpendingInsight() {
  const {
    transactions = [],
    settings = {},
    transactionsLoading = false,
    transactionsError = "",
  } = useExpense();

  const { language } = useLanguage();

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currency = settings?.currency || "BDT";

  const getTransactionType = (transaction) =>
    String(
      transaction.type ?? transaction.transaction_type ?? ""
    )
      .trim()
      .toLowerCase();

  const normalizeCategory = (category) =>
    String(category || "Other")
      .trim()
      .toLowerCase()
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ");

  const getTransactionDate = (dateValue) => {
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

    return Number.isNaN(date.getTime()) ? null : date;
  };

  const getMonthTransactions = (year, month) =>
    transactions.filter((transaction) => {
      const date = getTransactionDate(transaction.date);

      return (
        date &&
        date.getFullYear() === year &&
        date.getMonth() === month
      );
    });

  const currentMonthTransactions = getMonthTransactions(
    currentYear,
    currentMonth
  );

  const previousMonthDate = new Date(
    currentYear,
    currentMonth - 1,
    1
  );

  const previousMonthTransactions = getMonthTransactions(
    previousMonthDate.getFullYear(),
    previousMonthDate.getMonth()
  );

  const getExpenseAmount = (transaction) =>
    Math.max(0, Number(transaction.amount) || 0);

  const currentExpenses = currentMonthTransactions.filter(
    (transaction) => getTransactionType(transaction) === "expense"
  );

  const previousExpenses = previousMonthTransactions.filter(
    (transaction) => getTransactionType(transaction) === "expense"
  );

  const currentExpense = currentExpenses.reduce(
    (total, transaction) => total + getExpenseAmount(transaction),
    0
  );

  const previousExpense = previousExpenses.reduce(
    (total, transaction) => total + getExpenseAmount(transaction),
    0
  );

  const categoryTotals = currentExpenses.reduce(
    (result, transaction) => {
      const category = normalizeCategory(transaction.category);

      result[category] =
        (result[category] || 0) + getExpenseAmount(transaction);

      return result;
    },
    {}
  );

  const topCategory = Object.entries(categoryTotals).sort(
    (a, b) => b[1] - a[1]
  )[0];

  const hasCurrentData = currentExpense > 0;
  const hasPreviousData = previousExpense > 0;

  const percentageChange = hasPreviousData
    ? ((currentExpense - previousExpense) / previousExpense) * 100
    : 0;

  const isSpendingDown = hasPreviousData && percentageChange < 0;
  const isSpendingUp = hasPreviousData && percentageChange > 0;

  const formattedPercentage = formatNumber(
    Number(Math.abs(percentageChange).toFixed(1)),
    language
  );

  const monthName = now.toLocaleString(
    language === "bn" ? "bn-BD" : "en-US",
    { month: "long", year: "numeric" }
  );

  return (
    <div
      className="
        min-w-0 rounded-2xl border border-slate-200
        bg-white p-5 shadow-sm transition-all duration-200
        hover:shadow-md dark:border-slate-800
        dark:bg-slate-900 dark:hover:shadow-black/20 sm:p-6
      "
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div
          className="
            flex h-10 w-10 shrink-0 items-center justify-center
            rounded-xl bg-amber-50 text-amber-600
            transition-transform duration-200 hover:scale-105
            dark:bg-amber-950/40 dark:text-amber-400
          "
        >
          <Lightbulb size={20} aria-hidden="true" />
        </div>

        <div className="min-w-0">
          <h2 className="font-semibold tracking-tight text-slate-900 dark:text-white">
            Spending Insights
          </h2>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {monthName}
          </p>
        </div>
      </div>

      {/* Loading State */}
      {transactionsLoading ? (
        <div
          className="mt-6 flex flex-col items-center justify-center py-8 text-center"
          role="status"
          aria-live="polite"
        >
          <RefreshCw
            size={22}
            className="animate-spin text-slate-400"
            aria-hidden="true"
          />

          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Loading spending insights...
          </p>
        </div>
      ) : transactionsError ? (
        /* Error State */
        <div
          className="
            mt-6 rounded-2xl border border-red-200
            bg-red-50 p-4 dark:border-red-900/50
            dark:bg-red-950/20
          "
          role="alert"
        >
          <div className="flex items-start gap-3">
            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0 text-red-500"
              aria-hidden="true"
            />

            <div className="min-w-0">
              <p className="text-sm font-semibold text-red-700 dark:text-red-300">
                Unable to load spending insights.
              </p>

              <p className="mt-1 text-xs leading-5 text-red-600 dark:text-red-400">
                {transactionsError}
              </p>
            </div>
          </div>
        </div>
      ) : !hasCurrentData ? (
        /* Empty State */
        <div
          className="
            mt-6 animate-[insightIn_300ms_ease-out]
            rounded-2xl border border-slate-100
            bg-slate-50 p-4 dark:border-slate-800
            dark:bg-slate-800/60
          "
        >
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            No spending data yet
          </p>

          <p className="mt-1.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
            Add an expense this month to see your spending insights.
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-5">
          {/* Current Month Spending */}
          <div
            className="
              animate-[insightIn_300ms_ease-out]
              rounded-2xl border border-slate-100
              bg-slate-50 p-4 dark:border-slate-800
              dark:bg-slate-800/60
            "
          >
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  This Month
                </p>

                <p className="mt-1.5 wrap-break-words text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {formatCurrency(currentExpense, currency, language)}
                </p>
              </div>

              {hasPreviousData && (
                <div
                  className={`
                    flex shrink-0 items-center gap-1.5
                    rounded-xl px-2.5 py-1.5 text-xs font-bold
                    transition-transform duration-200 hover:scale-105
                    ${
                      isSpendingDown
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                        : isSpendingUp
                          ? "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                    }
                  `}
                >
                  {isSpendingDown ? (
                    <TrendingDown size={14} aria-hidden="true" />
                  ) : isSpendingUp ? (
                    <TrendingUp size={14} aria-hidden="true" />
                  ) : null}

                  {percentageChange > 0
                    ? "+"
                    : percentageChange < 0
                      ? "-"
                      : ""}
                  {formattedPercentage}%
                </div>
              )}
            </div>

            {hasPreviousData && (
              <p className="mt-2.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
                {isSpendingDown
                  ? "You're spending less than last month."
                  : isSpendingUp
                    ? "You're spending more than last month."
                    : "Your spending is unchanged from last month."}
              </p>
            )}
          </div>

          {/* Top Spending Category */}
          {topCategory && (
            <div
              className="
                flex animate-[insightIn_350ms_ease-out]
                items-center justify-between gap-4
                border-t border-slate-100 pt-5
                dark:border-slate-800
              "
            >
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Top Spending Category
                </p>

                <p className="mt-1.5 wrap-break-words text-sm font-semibold capitalize text-slate-900 dark:text-white">
                  {topCategory[0]}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                  {formatCurrency(topCategory[1], currency, language)}
                </p>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Total spent
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes insightIn {
          from {
            opacity: 0;
            transform: translateY(5px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default SpendingInsight;
