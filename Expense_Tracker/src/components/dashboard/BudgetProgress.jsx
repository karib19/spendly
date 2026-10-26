
import { WalletCards } from "lucide-react";
import { useExpense } from "../../context/ExpenseContext";
import { useLanguage } from "../../context/LanguageContext";
import { getCategoryLabel } from "../../utils/translations";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatNumber } from "../../utils/formatNumber";

function BudgetProgress() {
  const {
    budgets = [],
    transactions = [],
    settings,
    budgetsLoading = false,
    budgetsError = "",
    transactionsLoading = false,
    transactionsError = "",
  } = useExpense();

  const { t, language } = useLanguage();
  const isBangla = language === "bn";

  const now = new Date();

  const currentMonth = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;

  const getTransactionType = (transaction) =>
    String(
      transaction.type ?? transaction.transaction_type ?? ""
    )
      .trim()
      .toLowerCase();

  const normalizeCategory = (category) =>
    String(category ?? "")
      .trim()
      .toLowerCase()
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ");

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

    return `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;
  };

  const currentMonthBudgets = budgets.filter((budget) => {
    if (!budget.month) return true;

    return String(budget.month).slice(0, 7) === currentMonth;
  });

  const getCategorySpent = (category) => {
    const normalizedCategory = normalizeCategory(category);

    return transactions
      .filter((transaction) => {
        return (
          getTransactionType(transaction) === "expense" &&
          normalizeCategory(transaction.category) ===
            normalizedCategory &&
          getTransactionMonth(transaction.date) === currentMonth
        );
      })
      .reduce(
        (total, transaction) =>
          total + Math.max(0, Number(transaction.amount) || 0),
        0
      );
  };

  const totalBudget = currentMonthBudgets.reduce(
    (total, budget) =>
      total + Math.max(0, Number(budget.amount) || 0),
    0
  );

  // Count each category's spending only once in the overall total.
  const uniqueCategories = [
    ...new Set(
      currentMonthBudgets.map((budget) =>
        normalizeCategory(budget.category)
      )
    ),
  ];

  const totalSpent = uniqueCategories.reduce(
    (total, category) => total + getCategorySpent(category),
    0
  );

  const totalRemaining = totalBudget - totalSpent;

  const overallPercentage =
    totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const getProgressTone = (percentage) => {
    if (percentage >= 100) {
      return {
        text: "text-rose-600 dark:text-rose-400",
        bar: "bg-rose-500",
      };
    }

    if (percentage >= 80) {
      return {
        text: "text-amber-600 dark:text-amber-400",
        bar: "bg-amber-500",
      };
    }

    return {
      text: "text-slate-700 dark:text-slate-300",
      bar: "bg-slate-900 dark:bg-slate-100",
    };
  };

  const overallTone = getProgressTone(overallPercentage);

  const renderStatus = (message, isError = false) => (
    <div
      className={`mt-5 rounded-xl px-4 py-5 text-center text-sm ${
        isError
          ? "bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400"
          : "bg-slate-50 text-slate-500 dark:bg-slate-800/60 dark:text-slate-400"
      }`}
      role={isError ? "alert" : "status"}
    >
      {message}
    </div>
  );

  return (
    <div
      className="
        rounded-2xl border border-slate-200 bg-white p-5
        shadow-sm transition-all duration-200 hover:shadow-md
        dark:border-slate-800 dark:bg-slate-900
        dark:hover:shadow-black/20 sm:p-6
      "
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <div
              className="
                flex h-9 w-9 shrink-0 items-center justify-center
                rounded-xl bg-slate-100 text-slate-700
                transition-transform duration-200 hover:scale-105
                dark:bg-slate-800 dark:text-slate-300
              "
            >
              <WalletCards size={18} />
            </div>

            <h2 className="font-semibold tracking-tight text-slate-900 dark:text-white">
              {t("dashboard.monthlyBudget")}
            </h2>
          </div>

          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {t("dashboard.budgetOverview")}
          </p>
        </div>

        {currentMonthBudgets.length > 0 && (
          <div className="shrink-0 text-right">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
              {t("dashboard.spent")}
            </p>

            <p className="mt-1 text-sm font-bold tracking-tight text-slate-900 dark:text-white">
              {formatCurrency(totalSpent, settings.currency, language)}
            </p>
          </div>
        )}
      </div>

      {/* Loading state */}
      {budgetsLoading || transactionsLoading ? (
        renderStatus(
          isBangla
            ? "বাজেটের তথ্য লোড হচ্ছে..."
            : "Loading budget information..."
        )
      ) : budgetsError ? (
        renderStatus(
          isBangla
            ? "বাজেটের তথ্য লোড করা যায়নি। আবার চেষ্টা করো।"
            : "Unable to load budgets. Please try again.",
          true
        )
      ) : transactionsError ? (
        renderStatus(
          isBangla
            ? "লেনদেনের তথ্য লোড করা যায়নি। খরচের হিসাব দেখাতে সমস্যা হতে পারে।"
            : "Unable to load transactions. Spending totals may be incomplete.",
          true
        )
      ) : currentMonthBudgets.length > 0 ? (
        <>
          {/* Overall budget */}
          <div className="mt-6">
            <div className="flex items-end justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {formatCurrency(totalSpent, settings.currency, language)}{" "}
                  {t("dashboard.of")}{" "}
                  {formatCurrency(totalBudget, settings.currency, language)}
                </p>
              </div>

              <span
                className={`shrink-0 text-sm font-bold ${overallTone.text}`}
              >
                {formatNumber(Math.round(overallPercentage), language)}%
              </span>
            </div>

            <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className={`h-full rounded-full transition-[width] duration-700 ease-out ${overallTone.bar}`}
                style={{
                  width: `${Math.min(
                    Math.max(overallPercentage, 0),
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* Category budgets */}
          <div className="mt-6 space-y-5">
            {currentMonthBudgets.slice(0, 4).map((budget, index) => {
              const budgetAmount = Math.max(
                0,
                Number(budget.amount) || 0
              );

              const spent = getCategorySpent(budget.category);

              const percentage =
                budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0;

              const remaining = budgetAmount - spent;
              const tone = getProgressTone(percentage);

              return (
                <div
                  key={budget.id ?? `${budget.category}-${index}`}
                  className="group animate-[budgetItemIn_300ms_ease-out_both]"
                  style={{ animationDelay: `${index * 45}ms` }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-700 transition-colors group-hover:text-slate-900 dark:text-slate-300 dark:group-hover:text-white">
                        {getCategoryLabel(budget.category, t)}
                      </p>

                      <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                        {formatCurrency(spent, settings.currency, language)}{" "}
                        {t("dashboard.of")}{" "}
                        {formatCurrency(
                          budgetAmount,
                          settings.currency,
                          language
                        )}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className={`text-xs font-bold ${tone.text}`}>
                        {formatNumber(Math.round(percentage), language)}%
                      </p>

                      <p
                        className={`mt-1 text-[11px] ${
                          remaining < 0
                            ? "font-medium text-rose-500 dark:text-rose-400"
                            : "text-slate-400 dark:text-slate-500"
                        }`}
                      >
                        {remaining >= 0
                          ? `${formatCurrency(
                              remaining,
                              settings.currency,
                              language
                            )} ${t("dashboard.remaining")}`
                          : `${formatCurrency(
                              Math.abs(remaining),
                              settings.currency,
                              language
                            )} ${t("budgets.overBudget")}`}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className={`h-full rounded-full transition-[width] duration-700 ease-out ${tone.bar}`}
                      style={{
                        width: `${Math.min(
                          Math.max(percentage, 0),
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {currentMonthBudgets.length > 4 && (
            <p className="mt-5 text-center text-xs font-medium text-slate-400 dark:text-slate-500">
              +{formatNumber(currentMonthBudgets.length - 4, language)}{" "}
              {t("budgets.categories")}
            </p>
          )}

          {/* Remaining budget */}
          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {totalRemaining >= 0
                ? t("dashboard.remaining")
                : t("budgets.overBudget")}
            </span>

            <span
              className={`text-sm font-bold tracking-tight ${
                totalRemaining < 0
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-slate-900 dark:text-white"
              }`}
            >
              {formatCurrency(
                Math.abs(totalRemaining),
                settings.currency,
                language
              )}
            </span>
          </div>
        </>
      ) : (
        /* Empty state */
        <div className="py-11 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
            <WalletCards
              size={20}
              className="text-slate-400 dark:text-slate-500"
            />
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
            {t("budgets.noBudgets")}
          </p>

          <p className="mx-auto mt-1.5 max-w-xs text-xs leading-5 text-slate-400 dark:text-slate-500">
            {t("budgets.noBudgetsDescription")}
          </p>
        </div>
      )}

      <style>{`
        @keyframes budgetItemIn {
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

export default BudgetProgress;
