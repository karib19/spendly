import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { useExpense } from "../../context/ExpenseContext";

function BudgetForm({ isOpen, onClose, editingBudget }) {
  const {
    categories = {},
    budgets = [],
    addBudget,
    updateBudget,
  } = useExpense();

  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const expenseCategories = categories.expense || [];
  const isEditing = Boolean(editingBudget);

  const now = new Date();

  const currentMonth = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;

  useEffect(() => {
    if (!isOpen) return;

    if (editingBudget) {
      // Editing: keep the saved category selected.
      setCategory(editingBudget.category || "");
      setAmount(String(editingBudget.amount ?? ""));
    } else {
      // Creating: require the user to choose a category.
      setCategory("");
      setAmount("");
    }

    setError("");
    setIsSubmitting(false);
  }, [isOpen, editingBudget]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isSubmitting, onClose]);

  const getApiErrorMessage = (apiError) => {
    const data = apiError?.response?.data;

    if (typeof data === "string") {
      return data;
    }

    if (data && typeof data === "object") {
      const messages = Object.values(data)
        .flat(Infinity)
        .filter(
          (value) => typeof value === "string" && value.trim()
        );

      if (messages.length > 0) {
        return messages.join(" ");
      }
    }

    if (
      apiError?.response?.status === 401 ||
      apiError?.response?.status === 403
    ) {
      return "Your session may have expired. Please log in again.";
    }

    return (
      apiError?.message ||
      "Unable to save the budget. Please try again."
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    setError("");

    if (!category) {
      setError("Please select a category.");
      return;
    }

    const numericAmount = Number(amount);

    if (
      amount.trim() === "" ||
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      setError("Please enter a valid amount greater than zero.");
      return;
    }

    // Prevent duplicate category budgets for the current month.
    const duplicateBudget = budgets.some((budget) => {
      const budgetMonth = budget.month
        ? budget.month.slice(0, 7)
        : currentMonth;

      return (
        budget.category === category &&
        budgetMonth === currentMonth &&
        String(budget.id) !== String(editingBudget?.id)
      );
    });

    if (duplicateBudget) {
      setError(
        "A budget already exists for this category in the current month."
      );
      return;
    }

    const budgetData = {
      category,
      amount: numericAmount,
    };

    setIsSubmitting(true);

    try {
      if (isEditing) {
        await updateBudget(editingBudget.id, budgetData);
      } else {
        await addBudget(budgetData);
      }

      onClose();
    } catch (apiError) {
      console.error("Failed to save budget:", apiError);
      setError(getApiErrorMessage(apiError));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (event) => {
    if (
      event.target === event.currentTarget &&
      !isSubmitting
    ) {
      onClose();
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="
        fixed inset-0 z-50 flex items-center justify-center
        bg-slate-950/60 p-4 backdrop-blur-md
        animate-[fadeIn_180ms_ease-out]
      "
      onMouseDown={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="budget-form-title"
    >
      <div
        className="
          w-full max-w-md overflow-hidden rounded-3xl
          border border-slate-200/80 bg-white
          shadow-[0_25px_80px_rgba(15,23,42,0.25)]
          animate-[modalIn_220ms_ease-out]
          dark:border-slate-700/80 dark:bg-slate-900
          dark:shadow-[0_25px_80px_rgba(0,0,0,0.45)]
        "
      >
        {/* Header */}
        <div className="relative border-b border-slate-200 dark:border-slate-800">
          <div className="px-5 py-5 sm:px-6 sm:py-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2
                  id="budget-form-title"
                  className="text-lg font-bold tracking-tight text-slate-900 dark:text-white"
                >
                  {isEditing ? "Edit Budget" : "Create Budget"}
                </h2>

                <p className="mt-1.5 text-sm leading-5 text-slate-500 dark:text-slate-400">
                  {isEditing
                    ? "Update your monthly spending limit."
                    : "Set a spending limit for an expense category."}
                </p>
              </div>

              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="
                  flex h-9 w-9 shrink-0 items-center justify-center
                  rounded-xl text-slate-400
                  transition-all duration-200
                  hover:rotate-90 hover:bg-slate-100 hover:text-slate-700
                  active:scale-90 disabled:cursor-not-allowed disabled:opacity-50
                  dark:text-slate-500 dark:hover:bg-slate-800
                  dark:hover:text-white
                "
                aria-label="Close budget form"
              >
                <X size={19} />
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
          {/* Category */}
          <div>
            <label
              htmlFor="budget-category"
              className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
            >
              Expense Category
            </label>

            {expenseCategories.length > 0 ? (
              <select
                id="budget-category"
                value={category}
                onChange={(event) => {
                  setCategory(event.target.value);
                  setError("");
                }}
                disabled={isSubmitting}
                required
                className={`
                  w-full rounded-xl border bg-slate-50 px-4 py-3
                  text-sm text-slate-900 outline-none
                  transition-all duration-200
                  hover:border-slate-300 focus:bg-white focus:ring-4
                  disabled:cursor-not-allowed disabled:opacity-60
                  dark:bg-slate-800/80 dark:text-white
                  dark:hover:border-slate-600 dark:focus:bg-slate-800
                  ${
                    error
                      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10"
                      : "border-slate-200 focus:border-slate-400 focus:ring-slate-900/5 dark:border-slate-700 dark:focus:border-slate-500 dark:focus:ring-white/5"
                  }
                `}
              >
                <option value="">Select a category</option>

                {expenseCategories.map((expenseCategory) => (
                  <option
                    key={expenseCategory}
                    value={expenseCategory}
                  >
                    {expenseCategory}
                  </option>
                ))}
              </select>
            ) : (
              <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-5 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-400">
                No expense categories are available. Add an expense
                category before creating a budget.
              </p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label
              htmlFor="budget-amount"
              className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
            >
              Monthly Budget Amount
            </label>

            <input
              id="budget-amount"
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(event) => {
                setAmount(event.target.value);
                setError("");
              }}
              placeholder="e.g. 5000"
              disabled={isSubmitting}
              required
              className={`
                w-full rounded-xl border bg-slate-50 px-4 py-3
                text-sm text-slate-900 outline-none
                transition-all duration-200 placeholder:text-slate-400
                hover:border-slate-300 focus:bg-white focus:ring-4
                disabled:cursor-not-allowed disabled:opacity-60
                dark:bg-slate-800/80 dark:text-white
                dark:hover:border-slate-600 dark:focus:bg-slate-800
                ${
                  error
                    ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10"
                    : "border-slate-200 focus:border-slate-400 focus:ring-slate-900/5 dark:border-slate-700 dark:focus:border-slate-500 dark:focus:ring-white/5"
                }
              `}
            />

            <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
              Set the maximum amount you plan to spend in this category
              during the current month.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="
                rounded-xl border border-rose-200 bg-rose-50
                px-4 py-3 text-xs font-medium text-rose-700
                animate-[fadeIn_160ms_ease-out]
                dark:border-rose-900/50 dark:bg-rose-950/30
                dark:text-rose-400
              "
            >
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="
                rounded-xl border border-slate-200 px-4 py-3
                text-sm font-semibold text-slate-700
                transition-all duration-200
                hover:border-slate-300 hover:bg-slate-50
                active:scale-[0.98]
                disabled:cursor-not-allowed disabled:opacity-50
                dark:border-slate-700 dark:text-slate-200
                dark:hover:bg-slate-800
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || expenseCategories.length === 0}
              className="
                rounded-xl bg-slate-900 px-4 py-3
                text-sm font-semibold text-white shadow-sm
                transition-all duration-200
                hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md
                active:translate-y-0 active:scale-[0.98]
                disabled:cursor-not-allowed disabled:opacity-60
                disabled:hover:translate-y-0 disabled:hover:shadow-sm
                dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white
              "
            >
              {isSubmitting
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Create Budget"}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes modalIn {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}

export default BudgetForm;