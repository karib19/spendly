import { useMemo, useState } from "react";
import { AlertTriangle, Plus, WalletCards } from "lucide-react";

import { useExpense } from "../context/ExpenseContext";
import { useLanguage } from "../context/LanguageContext";

import BudgetCard from "../components/budgets/BudgetCard";
import BudgetForm from "../components/budgets/BudgetForm";
import ConfirmDialog from "../components/common/ConfirmDialog";

import { formatCurrency } from "../utils/formatCurrency";
import { formatNumber } from "../utils/formatNumber";

function Budgets() {
  const {
    budgets = [],
    budgetsLoading,
    budgetsError,
    transactions = [],
    settings = {},
    deleteBudget,
  } = useExpense();

  const { language } = useLanguage();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [budgetToDelete, setBudgetToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const now = new Date();

  const currentMonth = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;

  const currentMonthBudgets = useMemo(() => {
    return budgets.filter((budget) => {
      if (!budget.month) return true;

      return budget.month.startsWith(currentMonth);
    });
  }, [budgets, currentMonth]);

  const monthlySummary = useMemo(() => {
    const totalBudget = currentMonthBudgets.reduce(
      (total, budget) => total + Number(budget.amount || 0),
      0
    );

    const totalSpent = transactions
      .filter((transaction) => {
        return (
          transaction.type === "expense" &&
          transaction.date?.startsWith(currentMonth)
        );
      })
      .reduce(
        (total, transaction) => total + Number(transaction.amount || 0),
        0
      );

    const remaining = totalBudget - totalSpent;

    const progress =
      totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    return {
      totalBudget,
      totalSpent,
      remaining,
      progress,
    };
  }, [currentMonthBudgets, transactions, currentMonth]);

  const progressWidth = Math.min(monthlySummary.progress, 100);

  const isOverBudget =
    monthlySummary.totalSpent > monthlySummary.totalBudget;

  const isNearLimit =
    !isOverBudget && monthlySummary.progress >= 80;

  const progressClass = isOverBudget
    ? "bg-rose-500"
    : isNearLimit
      ? "bg-amber-500"
      : "bg-slate-900 dark:bg-slate-100";

  const progressTextClass = isOverBudget
    ? "text-rose-600 dark:text-rose-400"
    : isNearLimit
      ? "text-amber-600 dark:text-amber-400"
      : "text-slate-600 dark:text-slate-400";

  const currency = settings?.currency || "BDT";

  const openAddBudget = () => {
    setEditingBudget(null);
    setIsFormOpen(true);
  };

  const openEditBudget = (budget) => {
    setEditingBudget(budget);
    setIsFormOpen(true);
  };

  const closeBudgetForm = () => {
    setIsFormOpen(false);
    setEditingBudget(null);
  };

  const handleDeleteRequest = (budget) => {
    if (isDeleting) return;

    setDeleteError("");
    setBudgetToDelete(budget);
  };

  const handleCancelDelete = () => {
    if (isDeleting) return;

    setBudgetToDelete(null);
    setDeleteError("");
  };

  const handleConfirmDelete = async () => {
    if (!budgetToDelete || isDeleting) return;

    setIsDeleting(true);
    setDeleteError("");

    try {
      await deleteBudget(budgetToDelete.id);
      setBudgetToDelete(null);
    } catch (error) {
      console.error("Failed to delete budget:", error);

      const responseData = error?.response?.data;
      let apiMessage = "";

      if (typeof responseData === "string") {
        apiMessage = responseData;
      } else if (responseData && typeof responseData === "object") {
        const firstError = Object.values(responseData)
          .flat(Infinity)
          .find(
            (value) => typeof value === "string" && value.trim()
          );

        if (firstError) {
          apiMessage = firstError;
        }
      }

      setDeleteError(
        apiMessage ||
          error?.message ||
          "Could not delete this budget. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const deleteCategory = budgetToDelete?.category || "this category";

  const deleteMessage = budgetToDelete
    ? `Are you sure you want to delete the budget for ${deleteCategory}? This action cannot be undone.`
    : "";

  return (
    <div>
      {/* Header */}
      <div
        className="
          mb-8 flex flex-col gap-4
          sm:flex-row sm:items-end sm:justify-between
        "
      >
        <div className="flex items-start gap-3">
          <div
            className="
              flex h-11 w-11 shrink-0 items-center justify-center
              rounded-xl bg-slate-100 text-slate-700
              transition-transform duration-200 hover:scale-105
              dark:bg-slate-800 dark:text-slate-300
            "
          >
            <WalletCards size={21} strokeWidth={2} />
          </div>

          <div>
            <p className="mb-1 text-sm font-medium text-slate-500 dark:text-slate-400">
              Manage your spending
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Budgets
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Set spending limits and keep track of your monthly expenses.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openAddBudget}
          className="
            inline-flex items-center justify-center gap-2
            rounded-xl bg-slate-900 px-4 py-3 text-sm
            font-semibold text-white shadow-sm
            transition-all duration-200 hover:-translate-y-0.5
            hover:bg-slate-800 hover:shadow-md
            active:translate-y-0 active:scale-[0.98]
            dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white
          "
        >
          <Plus size={18} strokeWidth={2.1} />
          Add Budget
        </button>
      </div>

      {/* Loading and API errors */}
      {budgetsLoading && (
        <div
          role="status"
          className="
            mb-5 rounded-xl border border-slate-200 bg-white
            px-4 py-3 text-sm text-slate-600
            dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300
          "
        >
          Loading budgets...
        </div>
      )}

      {budgetsError && !budgetsLoading && (
        <div
          role="alert"
          className="
            mb-5 rounded-xl border border-rose-200 bg-rose-50
            px-4 py-3 text-sm text-rose-700
            dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400
          "
        >
          {budgetsError}
        </div>
      )}

      {/* Monthly Summary */}
      <section
        className="
          mb-7 rounded-2xl border border-slate-200 bg-white
          p-5 shadow-sm transition-all duration-200 hover:shadow-md
          dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-black/20
          sm:p-6
        "
      >
        <div
          className="
            flex flex-col gap-6
            lg:flex-row lg:items-center lg:justify-between
          "
        >
          <div>
            <h2 className="font-semibold tracking-tight text-slate-900 dark:text-white">
              Monthly Progress
            </h2>

            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
              Track your spending against your total monthly budget.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 sm:gap-8">
            <div className="min-w-0">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Budget
              </p>

              <p className="mt-1 text-base font-bold tracking-tight text-slate-900 dark:text-white sm:text-lg">
                {formatCurrency(monthlySummary.totalBudget, currency, language)}
              </p>
            </div>

            <div className="min-w-0">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Spent
              </p>

              <p
                className={`
                  mt-1 text-base font-bold tracking-tight sm:text-lg
                  ${
                    isOverBudget
                      ? "text-rose-600 dark:text-rose-400"
                      : "text-slate-900 dark:text-white"
                  }
                `}
              >
                {formatCurrency(monthlySummary.totalSpent, currency, language)}
              </p>
            </div>

            <div className="min-w-0">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Remaining
              </p>

              <p
                className={`
                  mt-1 text-base font-bold tracking-tight sm:text-lg
                  ${
                    monthlySummary.remaining < 0
                      ? "text-rose-600 dark:text-rose-400"
                      : "text-emerald-600 dark:text-emerald-400"
                  }
                `}
              >
                {formatCurrency(
                  Math.abs(monthlySummary.remaining),
                  currency,
                  language
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-7">
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className={`font-semibold ${progressTextClass}`}>
              {formatNumber(Math.round(monthlySummary.progress), language)}%
            </span>

            <span
              className={`
                text-right
                ${
                  isOverBudget
                    ? "font-semibold text-rose-600 dark:text-rose-400"
                    : isNearLimit
                      ? "font-semibold text-amber-600 dark:text-amber-400"
                      : "text-slate-500 dark:text-slate-400"
                }
              `}
            >
              {isOverBudget
                ? "Over budget"
                : isNearLimit
                  ? "You are approaching your budget limit"
                  : "Available to spend"}
            </span>
          </div>

          <div
            className="mt-2.5 h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
            role="progressbar"
            aria-label="Monthly budget usage"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.min(
              Math.round(monthlySummary.progress),
              100
            )}
          >
            <div
              className={`h-full rounded-full transition-[width] duration-700 ease-out ${progressClass}`}
              style={{ width: `${progressWidth}%` }}
            />
          </div>

          {isOverBudget && (
            <div
              className="
                mt-4 flex items-start gap-2.5 rounded-xl
                border border-rose-100 bg-rose-50 px-4 py-3
                text-xs text-rose-700 animate-[budgetWarningIn_300ms_ease-out]
                dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-400
              "
            >
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />

              <p className="leading-5">
                Amount over budget:{" "}
                <span className="font-bold">
                  {formatCurrency(
                    Math.abs(monthlySummary.remaining),
                    currency,
                    language
                  )}
                </span>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Category Budgets */}
      <section>
        <div className="mb-5">
          <h2 className="font-semibold tracking-tight text-slate-900 dark:text-white">
            Category Budgets
          </h2>

          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
            Review and manage your budget for each category.
          </p>
        </div>

        {budgetsLoading ? (
          <div
            className="
              rounded-2xl border border-slate-200 bg-white
              px-6 py-12 text-center text-sm text-slate-500
              dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400
            "
          >
            Loading budgets...
          </div>
        ) : currentMonthBudgets.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {currentMonthBudgets.map((budget, index) => (
              <div
                key={budget.id}
                className="animate-[budgetCardIn_350ms_ease-out_both]"
                style={{
                  animationDelay: `${Math.min(index * 45, 180)}ms`,
                }}
              >
                <BudgetCard
                  budget={budget}
                  onEdit={openEditBudget}
                  onDelete={handleDeleteRequest}
                />
              </div>
            ))}
          </div>
        ) : (
          <div
            className="
              rounded-2xl border border-dashed border-slate-300
              bg-white px-6 py-16 text-center shadow-sm
              transition-all duration-200 hover:border-slate-400
              dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600
            "
          >
            <div
              className="
                mx-auto flex h-12 w-12 items-center justify-center
                rounded-2xl bg-slate-100 text-slate-400
                dark:bg-slate-800 dark:text-slate-500
              "
            >
              <WalletCards size={22} />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
              No budgets yet
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
              Create a budget to track your spending and stay within your limits.
            </p>

            <button
              type="button"
              onClick={openAddBudget}
              className="
                mt-5 inline-flex items-center gap-2 rounded-xl
                bg-slate-900 px-4 py-3 text-sm font-semibold text-white
                shadow-sm transition-all duration-200 hover:-translate-y-0.5
                hover:bg-slate-800 hover:shadow-md active:translate-y-0
                active:scale-[0.98] dark:bg-slate-100 dark:text-slate-900
                dark:hover:bg-white
              "
            >
              <Plus size={17} />
              Add Budget
            </button>
          </div>
        )}
      </section>

      {/* Budget Form */}
      <BudgetForm
        isOpen={isFormOpen}
        onClose={closeBudgetForm}
        editingBudget={editingBudget}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(budgetToDelete)}
        title="Delete Budget"
        message={deleteMessage}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        error={deleteError}
      />

      <style>{`
        @keyframes budgetCardIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes budgetWarningIn {
          from {
            opacity: 0;
            transform: translateY(4px);
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

export default Budgets;