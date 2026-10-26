import { useEffect, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, X } from "lucide-react";

import { useExpense } from "../../context/ExpenseContext";
import { useLanguage } from "../../context/LanguageContext";

function CategoryForm({ isOpen, onClose }) {
  const { addCategory } = useExpense();
  const { t } = useLanguage();

  const [type, setType] = useState("expense");
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setType("expense");
    setCategoryName("");
    setError("");
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const normalizedName = categoryName.trim();

    if (!normalizedName) {
      setError(t("categoryForm.categoryName"));
      return;
    }

    const added = addCategory(type, normalizedName);

    if (!added) {
      setError(
        `"${normalizedName}" ${t("categoryForm.alreadyExists")}`
      );
      return;
    }

    onClose();
  };

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md animate-[fadeIn_180ms_ease-out]"
      onMouseDown={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="category-form-title"
    >
      <div
        className="
          w-full max-w-md overflow-hidden
          rounded-3xl
          border border-slate-200/80
          bg-white
          shadow-[0_25px_80px_rgba(15,23,42,0.25)]
          animate-[modalIn_220ms_ease-out]
          dark:border-slate-700/80
          dark:bg-slate-900
          dark:shadow-[0_25px_80px_rgba(0,0,0,0.45)]
        "
      >
        {/* Header */}
        <div className="border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-start justify-between gap-4 px-5 py-5 sm:px-6 sm:py-6">
            <div className="min-w-0">
              <h2
                id="category-form-title"
                className="text-lg font-bold tracking-tight text-slate-900 dark:text-white"
              >
                {t("categoryForm.addTitle")}
              </h2>

              <p className="mt-1.5 text-sm leading-5 text-slate-500 dark:text-slate-400">
                {t("categoryForm.addDescription")}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="
                flex h-9 w-9 shrink-0 items-center justify-center
                rounded-xl
                text-slate-400
                transition-all duration-200
                hover:rotate-90
                hover:bg-slate-100
                hover:text-slate-700
                active:scale-90
                dark:text-slate-500
                dark:hover:bg-slate-800
                dark:hover:text-white
              "
              aria-label={t("categoryForm.close")}
            >
              <X size={19} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-5 sm:p-6"
        >
          {/* Category Type */}
          <div>
            <label className="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-200">
              {t("categoryForm.categoryType")}
            </label>

            <div className="grid grid-cols-2 gap-3">
              {/* Expense */}
              <button
                type="button"
                onClick={() => {
                  setType("expense");
                  setError("");
                }}
                className={`
                  group flex items-center gap-3 rounded-2xl border
                  p-4 text-left
                  transition-all duration-200
                  active:scale-[0.98]
                  ${
                    type === "expense"
                      ? "border-rose-300 bg-rose-50 text-rose-700 shadow-sm dark:border-rose-900/70 dark:bg-rose-950/40 dark:text-rose-400"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800"
                  }
                `}
              >
                <span
                  className={`
                    flex h-10 w-10 shrink-0 items-center justify-center rounded-xl
                    transition-colors
                    ${
                      type === "expense"
                        ? "bg-rose-100 text-rose-600 dark:bg-rose-950/70 dark:text-rose-400"
                        : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-slate-700"
                    }
                  `}
                >
                  <ArrowDownLeft size={19} strokeWidth={2.2} />
                </span>

                <span>
                  <span className="block text-sm font-semibold">
                    {t("categoryForm.expense")}
                  </span>

                  <span
                    className={`
                      mt-0.5 block text-xs
                      ${
                        type === "expense"
                          ? "text-rose-500 dark:text-rose-400"
                          : "text-slate-400 dark:text-slate-500"
                      }
                    `}
                  >
                    {t("categoryForm.transactions")}
                  </span>
                </span>
              </button>

              {/* Income */}
              <button
                type="button"
                onClick={() => {
                  setType("income");
                  setError("");
                }}
                className={`
                  group flex items-center gap-3 rounded-2xl border
                  p-4 text-left
                  transition-all duration-200
                  active:scale-[0.98]
                  ${
                    type === "income"
                      ? "border-emerald-300 bg-emerald-50 text-emerald-700 shadow-sm dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-400"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800"
                  }
                `}
              >
                <span
                  className={`
                    flex h-10 w-10 shrink-0 items-center justify-center rounded-xl
                    transition-colors
                    ${
                      type === "income"
                        ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/70 dark:text-emerald-400"
                        : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-slate-700"
                    }
                  `}
                >
                  <ArrowUpRight size={19} strokeWidth={2.2} />
                </span>

                <span>
                  <span className="block text-sm font-semibold">
                    {t("categoryForm.income")}
                  </span>

                  <span
                    className={`
                      mt-0.5 block text-xs
                      ${
                        type === "income"
                          ? "text-emerald-500 dark:text-emerald-400"
                          : "text-slate-400 dark:text-slate-500"
                      }
                    `}
                  >
                    {t("categoryForm.transactions")}
                  </span>
                </span>
              </button>
            </div>
          </div>

          {/* Category Name */}
          <div>
            <label
              htmlFor="category-name"
              className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
            >
              {t("categoryForm.categoryName")}
            </label>

            <input
              id="category-name"
              type="text"
              value={categoryName}
              onChange={(event) => {
                setCategoryName(event.target.value);
                setError("");
              }}
              placeholder={t("categoryForm.categoryPlaceholder")}
              autoFocus
              maxLength={50}
              className={`
                w-full rounded-xl border
                bg-slate-50 px-4 py-3
                text-sm text-slate-900
                outline-none
                transition-all duration-200
                placeholder:text-slate-400
                hover:border-slate-300
                focus:bg-white
                focus:ring-4
                dark:bg-slate-800/80
                dark:text-white
                dark:hover:border-slate-600
                dark:focus:bg-slate-800
                ${
                  error
                    ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10"
                    : "border-slate-200 focus:border-slate-400 focus:ring-slate-900/5 dark:border-slate-700 dark:focus:border-slate-500 dark:focus:ring-white/5"
                }
              `}
            />

            {error && (
              <p className="mt-2 rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-600 animate-[fadeIn_160ms_ease-out] dark:bg-rose-950/30 dark:text-rose-400">
                {error}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800/70">
            <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
              {t("categoryForm.availableDescription")}{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {type === "expense"
                  ? t("categoryForm.expense")
                  : t("categoryForm.income")}
              </span>{" "}
              {t("categoryForm.transactions")}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="
                rounded-xl
                border border-slate-200
                px-4 py-3
                text-sm font-semibold
                text-slate-700
                transition-all duration-200
                hover:border-slate-300
                hover:bg-slate-50
                active:scale-[0.98]
                dark:border-slate-700
                dark:text-slate-200
                dark:hover:bg-slate-800
              "
            >
              {t("categoryForm.cancel")}
            </button>

            <button
              type="submit"
              className="
                rounded-xl
                bg-slate-900
                px-4 py-3
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
              {t("categoryForm.addCategory")}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
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

export default CategoryForm;
