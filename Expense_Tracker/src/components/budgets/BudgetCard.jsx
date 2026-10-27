import {
  AlertTriangle,
  Pencil,
  Trash2,
  WalletCards,
} from "lucide-react";

import { useExpense } from "../../context/ExpenseContext";
import { useLanguage } from "../../context/LanguageContext";
import { formatCurrency } from "../../utils/formatCurrency";

function BudgetCard({ budget, onEdit, onDelete }) {
  const { transactions, settings } = useExpense();
  const { language } = useLanguage();

  const currency = settings?.currency || "BDT";
  const currentMonth = new Date().toISOString().slice(0, 7);

  const spent = transactions
    .filter(
      (transaction) =>
        transaction.type === "expense" &&
        transaction.category === budget.category &&
        transaction.date?.startsWith(currentMonth)
    )
    .reduce(
      (total, transaction) => total + Number(transaction.amount || 0),
      0
    );

  const budgetAmount = Number(budget.amount) || 0;
  const remaining = budgetAmount - spent;

  const progress =
    budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0;

  const progressWidth = Math.min(progress, 100);
  const isOverBudget = spent > budgetAmount;
  const isNearLimit = !isOverBudget && progress >= 80;

  const progressClass = isOverBudget
    ? "bg-rose-500"
    : isNearLimit
      ? "bg-amber-500"
      : "bg-emerald-500";

  const progressTrackClass = isOverBudget
    ? "bg-rose-100 dark:bg-rose-950/50"
    : isNearLimit
      ? "bg-amber-100 dark:bg-amber-950/50"
      : "bg-slate-100 dark:bg-slate-800";

  return (
    <div
      className="
        group relative overflow-hidden rounded-2xl
        border border-slate-200 bg-white
        p-5 shadow-sm
        transition-all duration-200
        hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md
        dark:border-slate-800 dark:bg-slate-900
        dark:hover:border-slate-700
      "
    >
      {/* Top accent */}
      <div
        className={`absolute inset-x-0 top-0 h-0.5 ${
          isOverBudget
            ? "bg-rose-500"
            : isNearLimit
              ? "bg-amber-500"
              : "bg-emerald-500"
        }`}
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`
              flex h-10 w-10 shrink-0 items-center justify-center
              rounded-xl
              ${
                isOverBudget
                  ? "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400"
                  : isNearLimit
                    ? "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400"
                    : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
              }
            `}
          >
            <WalletCards size={18} />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
              {budget.category || "Uncategorized"}
            </h3>

            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Monthly Budget
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit?.(budget)}
            className="
              flex h-8 w-8 items-center justify-center rounded-lg
              text-slate-400
              transition-colors
              hover:bg-slate-100 hover:text-slate-700
              dark:text-slate-500
              dark:hover:bg-slate-800 dark:hover:text-white
            "
            aria-label={`Edit ${budget.category || "budget"}`}
            title="Edit budget"
          >
            <Pencil size={15} />
          </button>

          <button
            type="button"
            onClick={() => onDelete?.(budget)}
            className="
              flex h-8 w-8 items-center justify-center rounded-lg
              text-slate-400
              transition-colors
              hover:bg-rose-50 hover:text-rose-600
              dark:text-slate-500
              dark:hover:bg-rose-950/50 dark:hover:text-rose-400
            "
            aria-label={`Delete ${budget.category || "budget"}`}
            title="Delete budget"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Amount Summary */}
      <div className="mt-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Spent
          </p>

          <p
            className={`
              mt-1 text-2xl font-bold tracking-tight
              ${
                isOverBudget
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-slate-900 dark:text-white"
              }
            `}
          >
            {formatCurrency(spent, currency, language)}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Budget
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
            {formatCurrency(budgetAmount, currency, language)}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-5">
        <div
          className={`h-2 overflow-hidden rounded-full ${progressTrackClass}`}
          role="progressbar"
          aria-label={`${budget.category || "Budget"} spending progress`}
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className={`
              h-full rounded-full
              transition-[width] duration-700 ease-out
              ${progressClass}
            `}
            style={{ width: `${progressWidth}%` }}
          />
        </div>

        <div className="mt-2.5 flex items-center justify-between gap-3">
          <span
            className={`
              text-xs font-semibold
              ${
                isOverBudget
                  ? "text-rose-600 dark:text-rose-400"
                  : isNearLimit
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-slate-500 dark:text-slate-400"
              }
            `}
          >
            {Math.round(progress)}%
          </span>

          <span
            className={`
              text-xs
              ${
                isOverBudget
                  ? "font-semibold text-rose-600 dark:text-rose-400"
                  : "text-slate-500 dark:text-slate-400"
              }
            `}
          >
            {isOverBudget
              ? `${formatCurrency(
                  Math.abs(remaining),
                  currency,
                  language
                )} Over Budget`
              : `${formatCurrency(
                  remaining,
                  currency,
                  language
                )} Remaining`}
          </span>
        </div>
      </div>

      {/* Status */}
      {isOverBudget && (
        <div
          className="
            mt-5 flex items-start gap-2.5
            rounded-xl border border-rose-100
            bg-rose-50 px-3.5 py-3
            text-xs text-rose-700
            dark:border-rose-950/70
            dark:bg-rose-950/30 dark:text-rose-400
          "
        >
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />

          <p className="leading-5">
            You have exceeded this budget. Consider reducing spending in
            this category.
          </p>
        </div>
      )}

      {!isOverBudget && isNearLimit && (
        <div
          className="
            mt-5 flex items-start gap-2.5
            rounded-xl border border-amber-100
            bg-amber-50 px-3.5 py-3
            text-xs text-amber-700
            dark:border-amber-950/70
            dark:bg-amber-950/30 dark:text-amber-400
          "
        >
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />

          <p className="leading-5">
            You have used at least 80% of this budget. Keep an eye on your
            spending.
          </p>
        </div>
      )}
    </div>
  );
}

export default BudgetCard;