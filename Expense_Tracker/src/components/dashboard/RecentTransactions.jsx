
import { ArrowRight, Plus, RefreshCw, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

import { useExpense } from "../../context/ExpenseContext";
import { useLanguage } from "../../context/LanguageContext";

import TransactionCard from "../transactions/TransactionCard";

function RecentTransactions({
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

  const isBangla = language === "bn";

  const getTransactionTimestamp = (value) => {
    if (!value) return 0;

    const dateString = String(value);
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
        return 0;
      }
    } else {
      date = new Date(value);
    }

    return Number.isNaN(date.getTime()) ? 0 : date.getTime();
  };

  const recentTransactions = [...transactions]
    .sort((a, b) => {
      const dateDifference =
        getTransactionTimestamp(b.date) -
        getTransactionTimestamp(a.date);

      if (dateDifference !== 0) {
        return dateDifference;
      }

      return (Number(b.id) || 0) - (Number(a.id) || 0);
    })
    .slice(0, 5);

  return (
    <div
      className="
        rounded-2xl
        border border-slate-200
        bg-white
        p-5
        shadow-sm
        transition-all duration-200
        hover:shadow-md
        dark:border-slate-800
        dark:bg-slate-900
        dark:hover:shadow-black/20
        sm:p-6
      "
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-semibold tracking-tight text-slate-900 dark:text-white">
            {t("dashboard.recentTransactions")}
          </h2>

          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
            {t("dashboard.latestTransactions")}
          </p>
        </div>

        {recentTransactions.length > 0 &&
          !transactionsLoading &&
          !transactionsError && (
            <Link
              to="/transactions"
              className="
                group
                inline-flex shrink-0 items-center gap-1.5
                rounded-lg
                px-2 py-1
                text-xs font-semibold
                text-slate-500
                transition-all duration-200
                hover:bg-slate-100
                hover:text-slate-900
                dark:text-slate-400
                dark:hover:bg-slate-800
                dark:hover:text-white
              "
            >
              <span>{t("dashboard.viewAll")}</span>

              <ArrowRight
                size={14}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
          )}
      </div>

      {/* Loading State */}
      {transactionsLoading ? (
        <div
          className="flex flex-col items-center justify-center py-12 text-center"
          role="status"
          aria-live="polite"
        >
          <RefreshCw
            size={24}
            className="animate-spin text-slate-400"
          />

          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            {t("common.loading") ||
              (isBangla
                ? "লেনদেনের তথ্য লোড হচ্ছে..."
                : "Loading transactions...")}
          </p>
        </div>
      ) : transactionsError ? (
        /* Error State */
        <div
          className="
            mt-5 flex flex-col items-center
            rounded-xl border border-red-200
            bg-red-50 px-4 py-8 text-center
            dark:border-red-900/50
            dark:bg-red-950/20
          "
          role="alert"
        >
          <AlertCircle
            size={24}
            className="text-red-500"
          />

          <p className="mt-3 text-sm font-medium text-red-700 dark:text-red-300">
            {t("dashboard.transactionsLoadError") ||
              (isBangla
                ? "লেনদেন লোড করা যায়নি।"
                : "Unable to load transactions.")}
          </p>

          <p className="mt-1 text-xs text-red-600 dark:text-red-400">
            {transactionsError}
          </p>
        </div>
      ) : recentTransactions.length > 0 ? (
        /* Recent Transactions */
        <div className="mt-5 space-y-2">
          {recentTransactions.map((transaction, index) => (
            <div
              key={
                transaction.id ??
                `${transaction.date}-${transaction.title}-${index}`
              }
              className="animate-[transactionIn_300ms_ease-out_both]"
              style={{
                animationDelay: `${index * 45}ms`,
              }}
            >
              <TransactionCard
                transaction={transaction}
                onEdit={onEditTransaction}
                onDelete={onDeleteTransaction}
              />
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div
          className="
            flex flex-col items-center
            py-12
            text-center
            animate-[emptyStateIn_300ms_ease-out]
          "
        >
          <div
            className="
              flex h-12 w-12 items-center justify-center
              rounded-2xl
              bg-slate-100
              text-slate-400
              transition-transform duration-200
              hover:scale-105
              dark:bg-slate-800
              dark:text-slate-500
            "
          >
            <Plus size={20} />
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
            {t("dashboard.noTransactions")}
          </p>

          <p className="mx-auto mt-1.5 max-w-xs text-xs leading-5 text-slate-400 dark:text-slate-500">
            {t("dashboard.noTransactionsDescription")}
          </p>

          <button
            type="button"
            onClick={onAddTransaction}
            className="
              mt-5
              inline-flex items-center gap-2
              rounded-xl
              bg-slate-900
              px-4 py-2.5
              text-sm font-semibold
              text-white
              shadow-sm
              transition-all duration-200
              hover:-translate-y-0.5
              hover:bg-slate-800
              hover:shadow-md
              active:translate-y-0
              active:scale-[0.98]
              dark:bg-slate-100
              dark:text-slate-900
              dark:hover:bg-white
            "
          >
            <Plus size={17} />
            {t("dashboard.addTransaction")}
          </button>
        </div>
      )}

      <style>{`
        @keyframes transactionIn {
          from {
            opacity: 0;
            transform: translateY(5px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes emptyStateIn {
          from {
            opacity: 0;
            transform: translateY(6px);
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

export default RecentTransactions;
