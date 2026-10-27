import {
  ArrowDownLeft,
  ArrowUpRight,
  Pencil,
  Trash2,
} from "lucide-react";

import { useExpense } from "../../context/ExpenseContext";
import { useLanguage } from "../../context/LanguageContext";

import { formatCurrency } from "../../utils/formatCurrency";

function TransactionCard({ transaction, onEdit, onDelete }) {
  const { settings = {} } = useExpense();
  const { language } = useLanguage();

  const isIncome = transaction.type === "income";

  const title = transaction.title?.trim() || "Untitled";
  const category = transaction.category?.trim() || "Uncategorized";
  const date = transaction.date || "—";

  return (
    <div
      className="
        group
        flex items-center justify-between
        gap-3
        rounded-xl
        border-b border-slate-100
        py-3.5
        transition-all duration-200
        last:border-b-0
        hover:bg-slate-50/80
        dark:border-slate-800
        dark:hover:bg-slate-800/40
        sm:gap-4
      "
    >
      {/* Transaction information */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {/* Type icon */}
        <div
          className={`
            flex h-11 w-11
            shrink-0
            items-center justify-center
            rounded-xl
            transition-transform duration-200
            group-hover:scale-105
            ${
              isIncome
                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                : "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"
            }
          `}
        >
          {isIncome ? (
            <ArrowUpRight size={20} strokeWidth={2} />
          ) : (
            <ArrowDownLeft size={20} strokeWidth={2} />
          )}
        </div>

        {/* Details */}
        <div className="min-w-0 flex-1">
          <h4
            className="
              truncate
              text-sm font-semibold
              text-slate-900
              dark:text-white
            "
            title={title}
          >
            {title}
          </h4>

          <p
            className="
              mt-1
              truncate
              text-xs
              text-slate-500
              dark:text-slate-400
            "
          >
            {category}

            <span className="mx-1.5 text-slate-300 dark:text-slate-600">
              •
            </span>

            {date}
          </p>

          <p
            className={`
              mt-1
              text-sm
              font-bold
              tracking-tight
              ${
                isIncome
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400"
              }
            `}
          >
            {isIncome ? "+" : "-"}
            {formatCurrency(
              transaction.amount,
              settings.currency || "BDT",
              language
            )}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div
        className="
          flex
          shrink-0
          items-center
          gap-0.5
          opacity-100
          transition-opacity duration-200
          sm:opacity-70
          sm:group-hover:opacity-100
        "
      >
        <button
          type="button"
          onClick={() => onEdit?.(transaction)}
          className="
            flex h-9 w-9
            items-center justify-center
            rounded-lg
            text-slate-400
            transition-all duration-200
            hover:bg-slate-100
            hover:text-slate-900
            active:scale-95
            dark:text-slate-500
            dark:hover:bg-slate-700
            dark:hover:text-white
          "
          aria-label={`Edit ${title}`}
          title="Edit"
        >
          <Pencil size={16} />
        </button>

        <button
          type="button"
          onClick={() => onDelete?.(transaction)}
          className="
            flex h-9 w-9
            items-center justify-center
            rounded-lg
            text-rose-400
            transition-all duration-200
            hover:bg-rose-50
            hover:text-rose-600
            active:scale-95
            dark:text-rose-500
            dark:hover:bg-rose-950/50
            dark:hover:text-rose-400
          "
          aria-label={`Delete ${title}`}
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export default TransactionCard;