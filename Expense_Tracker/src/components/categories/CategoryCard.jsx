import {
  ArrowDownLeft,
  ArrowUpRight,
  Trash2,
} from "lucide-react";

import { useExpense } from "../../context/ExpenseContext";
import { useLanguage } from "../../context/LanguageContext";

import { formatNumber } from "../../utils/formatNumber";

function CategoryCard({ category, type, onDelete }) {
  const { transactions } = useExpense();
  const { language } = useLanguage();

  const transactionCount = transactions.filter((transaction) => {
    const transactionType =
      transaction.type || transaction.transaction_type;

    return (
      transaction.category === category &&
      transactionType === type
    );
  }).length;

  const isExpense = type === "expense";

  return (
    <div
      className="
        group flex items-center justify-between gap-4
        rounded-2xl border border-slate-200 bg-white p-4
        shadow-sm transition-all duration-200
        hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md
        dark:border-slate-800 dark:bg-slate-900
        dark:hover:border-slate-700 dark:hover:shadow-black/20
      "
    >
      {/* Category Info */}
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`
            flex h-11 w-11 shrink-0 items-center justify-center
            rounded-xl transition-transform duration-200
            group-hover:scale-105
            ${
              isExpense
                ? "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400"
                : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
            }
          `}
        >
          {isExpense ? (
            <ArrowDownLeft size={19} strokeWidth={2.2} />
          ) : (
            <ArrowUpRight size={19} strokeWidth={2.2} />
          )}
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
            {category}
          </h3>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {formatNumber(transactionCount, language)}{" "}
            {transactionCount === 1 ? "transaction" : "transactions"}
          </p>
        </div>
      </div>

      {/* Delete */}
      <button
        type="button"
        onClick={() => onDelete?.(category)}
        className="
          flex h-9 w-9 shrink-0 items-center justify-center
          rounded-xl text-slate-400
          transition-all duration-200
          hover:bg-rose-50 hover:text-rose-600
          active:scale-90
          dark:text-slate-500
          dark:hover:bg-rose-950/50 dark:hover:text-rose-400
        "
        aria-label={`Delete ${category}`}
        title={`Delete ${category}`}
      >
        <Trash2 size={17} />
      </button>
    </div>
  );
}

export default CategoryCard;