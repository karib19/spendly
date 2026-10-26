
import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { useExpense } from "../../context/ExpenseContext";
import { useLanguage } from "../../context/LanguageContext";

import { getCategoryLabel } from "../../utils/translations";
import { getCurrencySymbol } from "../../utils/formatCurrency";

const paymentMethods = [
  "Cash",
  "Card",
  "Bank",
  "Mobile Banking",
];

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const getDefaultFormData = (type = "expense", categories = {}) => ({
  title: "",
  amount: "",
  category:
    type === "expense"
      ? categories.expense?.[0] || ""
      : categories.income?.[0] || "",
  date: getTodayDate(),
  paymentMethod: "Cash",
  note: "",
});

function getInitialFormData(editingTransaction, categories) {
  if (editingTransaction) {
    return {
      title: editingTransaction.title || "",
      amount: editingTransaction.amount ?? "",
      category: editingTransaction.category || "",
      date: editingTransaction.date || getTodayDate(),
      paymentMethod: editingTransaction.paymentMethod || "Cash",
      note: editingTransaction.note || "",
    };
  }

  return getDefaultFormData("expense", categories);
}

function TransactionForm({
  isOpen,
  onClose,
  editingTransaction = null,
}) {
  const {
    categories,
    settings,
    addTransaction,
    updateTransaction,
  } = useExpense();

  const { t } = useLanguage();

  const [type, setType] = useState(
    editingTransaction?.type === "income" ? "income" : "expense"
  );

  const [formData, setFormData] = useState(() =>
    getInitialFormData(editingTransaction, categories)
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isEditing = Boolean(editingTransaction);

  const availableCategories =
    type === "expense"
      ? categories.expense || []
      : categories.income || [];

  const categoryOptions = [
    ...(formData.category &&
    !availableCategories.includes(formData.category)
      ? [formData.category]
      : []),
    ...availableCategories,
  ];

  const currencySymbol = getCurrencySymbol(settings.currency);

  // Refresh the form whenever a new transaction is opened for editing.
  useEffect(() => {
    if (!isOpen) return;

    const initialType =
      editingTransaction?.type === "income" ? "income" : "expense";

    setType(initialType);
    setFormData(getInitialFormData(editingTransaction, categories));
    setErrorMessage("");
    setIsSubmitting(false);
  }, [isOpen, editingTransaction, categories]);

  // Close the drawer with Escape.
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

  const handleTypeChange = (newType) => {
    const newCategories =
      newType === "expense"
        ? categories.expense || []
        : categories.income || [];

    setType(newType);
    setErrorMessage("");

    setFormData((currentData) => ({
      ...currentData,
      category: newCategories[0] || "",
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    const title = formData.title.trim();
    const amount = Number(formData.amount);
    const category = formData.category.trim();
    const note = formData.note.trim();

    if (!title) {
      setErrorMessage("Please enter a transaction description.");
      return;
    }

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      setErrorMessage("Please enter a valid amount greater than zero.");
      return;
    }

    if (!category) {
      setErrorMessage("Please select a category.");
      return;
    }

    if (!formData.date) {
      setErrorMessage("Please select a date.");
      return;
    }

    const transactionData = {
      title,
      amount,
      category,
      date: formData.date,
      paymentMethod: formData.paymentMethod || "Cash",
      note,
      type,
    };

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      if (isEditing) {
        await updateTransaction(
          editingTransaction.id,
          transactionData
        );
      } else {
        await addTransaction(transactionData);
      }

      onClose();
    } catch (error) {
      console.error("Transaction form submission failed:", error);

      const status = error.response?.status;

      if (status === 400) {
        setErrorMessage(
          "Please check your transaction details and try again."
        );
      } else if (status === 401 || status === 403) {
        setErrorMessage(
          "Your session may have expired. Please log in again."
        );
      } else if (!error.response) {
        setErrorMessage(
          "Unable to connect to the server. Check your connection and try again."
        );
      } else {
        setErrorMessage(
          "Something went wrong while saving the transaction. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPaymentMethodLabel = (method) => {
    const labels = {
      Cash: t("transactionForm.cash"),
      Card: t("transactionForm.card"),
      Bank: t("transactionForm.bank"),
      "Mobile Banking": t("transactionForm.mobileBanking"),
    };

    return labels[method] || method;
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="transaction-form-title"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label={t("transactionForm.close")}
        onClick={() => {
          if (!isSubmitting) onClose();
        }}
        disabled={isSubmitting}
        className="
          absolute inset-0 h-full w-full cursor-default
          bg-slate-950/50 backdrop-blur-sm
          animate-[backdropIn_200ms_ease-out]
        "
      />

      {/* Drawer */}
      <div
        className="
          absolute right-0 top-0 flex h-full w-full max-w-md
          flex-col border-l border-slate-200 bg-white shadow-2xl
          animate-[drawerIn_280ms_cubic-bezier(0.22,1,0.36,1)]
          dark:border-slate-800 dark:bg-slate-950
        "
      >
        {/* Header */}
        <div
          className="
            flex shrink-0 items-center justify-between
            border-b border-slate-200 px-5 py-5
            dark:border-slate-800
          "
        >
          <div className="min-w-0 pr-4">
            <h2
              id="transaction-form-title"
              className="
                text-lg font-bold tracking-tight
                text-slate-900 dark:text-white
              "
            >
              {isEditing
                ? t("transactionForm.editTitle")
                : t("transactionForm.addTitle")}
            </h2>

            <p
              className="
                mt-1 text-xs leading-5
                text-slate-500 dark:text-slate-400
              "
            >
              {isEditing
                ? t("transactionForm.editDescription")
                : t("transactionForm.addDescription")}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="
              flex h-9 w-9 shrink-0 items-center justify-center
              rounded-xl text-slate-500 transition-all duration-200
              hover:bg-slate-100 hover:text-slate-900
              active:scale-95 disabled:opacity-50
              dark:text-slate-400 dark:hover:bg-slate-800
              dark:hover:text-white
            "
            aria-label={t("transactionForm.close")}
          >
            <X size={19} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div
            className="
              min-h-0 flex-1 space-y-5 overflow-y-auto p-5 sm:p-6
            "
          >
            {/* Transaction Type */}
            <div>
              <label
                className="
                  mb-2 block text-sm font-semibold
                  text-slate-700 dark:text-slate-300
                "
              >
                {t("transactionForm.transactionType")}
              </label>

              <div
                className="
                  grid grid-cols-2 gap-1 rounded-xl
                  bg-slate-100 p-1 dark:bg-slate-800
                "
              >
                <button
                  type="button"
                  onClick={() => handleTypeChange("expense")}
                  disabled={isSubmitting}
                  className={`
                    rounded-lg py-2.5 text-sm font-semibold
                    transition-all duration-200
                    ${
                      type === "expense"
                        ? "bg-white text-rose-600 shadow-sm dark:bg-slate-700 dark:text-rose-400"
                        : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    }
                  `}
                >
                  {t("transactionForm.expense")}
                </button>

                <button
                  type="button"
                  onClick={() => handleTypeChange("income")}
                  disabled={isSubmitting}
                  className={`
                    rounded-lg py-2.5 text-sm font-semibold
                    transition-all duration-200
                    ${
                      type === "income"
                        ? "bg-white text-emerald-600 shadow-sm dark:bg-slate-700 dark:text-emerald-400"
                        : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    }
                  `}
                >
                  {t("transactionForm.income")}
                </button>
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="title"
                className="
                  mb-2 block text-sm font-semibold
                  text-slate-700 dark:text-slate-300
                "
              >
                {t("transactionForm.description")}
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                required
                maxLength={150}
                autoComplete="off"
                disabled={isSubmitting}
                placeholder={t(
                  "transactionForm.descriptionPlaceholder"
                )}
                className="
                  w-full rounded-xl border border-slate-200 bg-white
                  px-4 py-3 text-sm text-slate-900 outline-none
                  transition-all duration-200 placeholder:text-slate-400
                  hover:border-slate-300 focus:border-slate-400
                  focus:ring-4 focus:ring-slate-900/5
                  disabled:opacity-60
                  dark:border-slate-700 dark:bg-slate-800
                  dark:text-white dark:placeholder:text-slate-500
                  dark:hover:border-slate-600 dark:focus:border-slate-500
                  dark:focus:ring-white/5
                "
              />
            </div>

            {/* Amount */}
            <div>
              <label
                htmlFor="amount"
                className="
                  mb-2 block text-sm font-semibold
                  text-slate-700 dark:text-slate-300
                "
              >
                {t("transactionForm.amount")}
              </label>

              <div className="relative">
                <span
                  className="
                    pointer-events-none absolute left-4 top-1/2
                    -translate-y-1/2 text-sm font-semibold
                    text-slate-500 dark:text-slate-400
                  "
                >
                  {currencySymbol}
                </span>

                <input
                  id="amount"
                  name="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  inputMode="decimal"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  placeholder="0.00"
                  className="
                    w-full rounded-xl border border-slate-200 bg-white
                    py-3 pl-9 pr-4 text-sm font-medium text-slate-900
                    outline-none transition-all duration-200
                    placeholder:text-slate-400 hover:border-slate-300
                    focus:border-slate-400 focus:ring-4
                    focus:ring-slate-900/5 disabled:opacity-60
                    dark:border-slate-700 dark:bg-slate-800
                    dark:text-white dark:placeholder:text-slate-500
                    dark:hover:border-slate-600 dark:focus:border-slate-500
                    dark:focus:ring-white/5
                  "
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="
                  mb-2 block text-sm font-semibold
                  text-slate-700 dark:text-slate-300
                "
              >
                {t("transactionForm.category")}
              </label>

              {categoryOptions.length > 0 ? (
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="
                    w-full rounded-xl border border-slate-200 bg-white
                    px-4 py-3 text-sm text-slate-900 outline-none
                    transition-all duration-200 hover:border-slate-300
                    focus:border-slate-400 focus:ring-4
                    focus:ring-slate-900/5 disabled:opacity-60
                    dark:border-slate-700 dark:bg-slate-800
                    dark:text-white dark:hover:border-slate-600
                    dark:focus:border-slate-500 dark:focus:ring-white/5
                  "
                >
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {getCategoryLabel(category, t)}
                    </option>
                  ))}
                </select>
              ) : (
                <div
                  className="
                    rounded-xl border border-amber-200 bg-amber-50
                    px-4 py-3 text-sm leading-5 text-amber-700
                    dark:border-amber-900 dark:bg-amber-950/40
                    dark:text-amber-400
                  "
                >
                  {t("transactionForm.noCategories")}{" "}
                  {type === "expense"
                    ? t("transactionForm.expense").toLowerCase()
                    : t("transactionForm.income").toLowerCase()}{" "}
                  {t("transactionForm.categoriesAvailable")}
                </div>
              )}
            </div>

            {/* Date */}
            <div>
              <label
                htmlFor="date"
                className="
                  mb-2 block text-sm font-semibold
                  text-slate-700 dark:text-slate-300
                "
              >
                {t("transactionForm.date")}
              </label>

              <input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="
                  w-full rounded-xl border border-slate-200 bg-white
                  px-4 py-3 text-sm text-slate-900 outline-none
                  transition-all duration-200 hover:border-slate-300
                  focus:border-slate-400 focus:ring-4
                  focus:ring-slate-900/5 disabled:opacity-60
                  dark:border-slate-700 dark:bg-slate-800
                  dark:text-white dark:hover:border-slate-600
                  dark:focus:border-slate-500 dark:focus:ring-white/5
                "
              />
            </div>

            {/* Payment Method */}
            <div>
              <label
                htmlFor="paymentMethod"
                className="
                  mb-2 block text-sm font-semibold
                  text-slate-700 dark:text-slate-300
                "
              >
                {t("transactionForm.paymentMethod")}
              </label>

              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                disabled={isSubmitting}
                className="
                  w-full rounded-xl border border-slate-200 bg-white
                  px-4 py-3 text-sm text-slate-900 outline-none
                  transition-all duration-200 hover:border-slate-300
                  focus:border-slate-400 focus:ring-4
                  focus:ring-slate-900/5 disabled:opacity-60
                  dark:border-slate-700 dark:bg-slate-800
                  dark:text-white dark:hover:border-slate-600
                  dark:focus:border-slate-500 dark:focus:ring-white/5
                "
              >
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {getPaymentMethodLabel(method)}
                  </option>
                ))}
              </select>
            </div>

            {/* Note */}
            <div>
              <label
                htmlFor="note"
                className="
                  mb-2 block text-sm font-semibold
                  text-slate-700 dark:text-slate-300
                "
              >
                {t("transactionForm.note")}
                <span
                  className="
                    ml-1 font-normal text-slate-400
                    dark:text-slate-500
                  "
                >
                  {t("transactionForm.optional")}
                </span>
              </label>

              <textarea
                id="note"
                name="note"
                rows="3"
                value={formData.note}
                onChange={handleChange}
                maxLength={500}
                disabled={isSubmitting}
                placeholder={t(
                  "transactionForm.notePlaceholder"
                )}
                className="
                  w-full resize-none rounded-xl border
                  border-slate-200 bg-white px-4 py-3
                  text-sm leading-5 text-slate-900 outline-none
                  transition-all duration-200 placeholder:text-slate-400
                  hover:border-slate-300 focus:border-slate-400
                  focus:ring-4 focus:ring-slate-900/5
                  disabled:opacity-60
                  dark:border-slate-700 dark:bg-slate-800
                  dark:text-white dark:placeholder:text-slate-500
                  dark:hover:border-slate-600 dark:focus:border-slate-500
                  dark:focus:ring-white/5
                "
              />
            </div>

            {/* API and validation errors */}
            {errorMessage && (
              <div
                role="alert"
                className="
                  rounded-xl border border-rose-200 bg-rose-50
                  px-4 py-3 text-sm leading-5 text-rose-700
                  dark:border-rose-900 dark:bg-rose-950/40
                  dark:text-rose-300
                "
              >
                {errorMessage}
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            className="
              shrink-0 border-t border-slate-200 bg-white
              p-5 dark:border-slate-800 dark:bg-slate-950 sm:p-6
            "
          >
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="
                  flex-1 rounded-xl border border-slate-200
                  bg-white px-4 py-3 text-sm font-semibold
                  text-slate-700 transition-all duration-200
                  hover:border-slate-300 hover:bg-slate-50
                  active:scale-[0.98] disabled:opacity-50
                  dark:border-slate-700 dark:bg-slate-900
                  dark:text-slate-200 dark:hover:border-slate-600
                  dark:hover:bg-slate-800
                "
              >
                {t("common.cancel")}
              </button>

              <button
                type="submit"
                disabled={isSubmitting || categoryOptions.length === 0}
                className={`
                  flex-1 rounded-xl px-4 py-3 text-sm font-semibold
                  text-white shadow-sm transition-all duration-200
                  hover:-translate-y-0.5 hover:shadow-md
                  active:translate-y-0 active:scale-[0.98]
                  disabled:cursor-not-allowed disabled:opacity-50
                  disabled:hover:translate-y-0
                  ${
                    type === "expense"
                      ? "bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                      : "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400"
                  }
                `}
              >
                {isSubmitting
                  ? "Saving..."
                  : isEditing
                    ? t("transactionForm.saveChanges")
                    : type === "expense"
                      ? t("transactionForm.addExpense")
                      : t("transactionForm.addIncome")}
              </button>
            </div>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes backdropIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes drawerIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}

export default TransactionForm;
