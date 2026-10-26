import { useState } from "react";

import { Plus, Tags } from "lucide-react";

import { useExpense } from "../context/ExpenseContext";
import { useLanguage } from "../context/LanguageContext";

import { formatNumber } from "../utils/formatNumber";
import { getCategoryLabel } from "../utils/translations";

import CategoryCard from "../components/categories/CategoryCard";
import CategoryForm from "../components/categories/CategoryForm";
import ConfirmDialog from "../components/common/ConfirmDialog";

function Categories() {
  const {
    categories,
    transactions,
    deleteCategory,
  } = useExpense();

  const { t, language } = useLanguage();

  const [isFormOpen, setIsFormOpen] =
    useState(false);

  const [categoryToDelete, setCategoryToDelete] =
    useState(null);

  const expenseCategories =
    categories.expense || [];

  const incomeCategories =
    categories.income || [];

  const getTransactionCount = (
    category,
    type
  ) => {
    return transactions.filter(
      (transaction) =>
        transaction.category === category &&
        transaction.type === type
    ).length;
  };

  const handleDeleteRequest = (
    category,
    type
  ) => {
    setCategoryToDelete({
      category,
      type,
    });
  };

  const handleConfirmDelete = () => {
    if (!categoryToDelete) {
      return;
    }

    deleteCategory(
      categoryToDelete.type,
      categoryToDelete.category
    );

    setCategoryToDelete(null);
  };

  const handleCancelDelete = () => {
    setCategoryToDelete(null);
  };

  const getDeleteMessage = () => {
    if (!categoryToDelete) {
      return "";
    }

    const {
      category,
      type,
    } = categoryToDelete;

    const transactionCount =
      getTransactionCount(
        category,
        type
      );

    const categoryLabel =
      getCategoryLabel(category, t);

    if (transactionCount > 0) {
      const transactionWord =
        transactionCount === 1
          ? t("categories.transaction")
          : t("categories.transactions");

      return t(
        "categories.deleteUsedMessage"
      )
        .replace(
          "{category}",
          categoryLabel
        )
        .replace(
          "{count}",
          formatNumber(
            transactionCount,
            language
          )
        )
        .replace(
          "{transactionWord}",
          transactionWord
        );
    }

    return type === "expense"
      ? t(
          "categories.deleteExpenseMessage"
        ).replace(
          "{category}",
          categoryLabel
        )
      : t(
          "categories.deleteIncomeMessage"
        ).replace(
          "{category}",
          categoryLabel
        );
  };

  return (
    <div>
      {/* Header */}
      <div
        className="
          mb-8
          flex flex-col gap-4
          sm:flex-row
          sm:items-end
          sm:justify-between
        "
      >
        <div>
          <div className="flex items-start gap-3">
            <div
              className="
                flex h-11 w-11
                shrink-0
                items-center justify-center
                rounded-xl
                bg-slate-100
                text-slate-700
                transition-transform duration-200
                hover:scale-105
                dark:bg-slate-800
                dark:text-slate-300
              "
            >
              <Tags
                size={21}
                strokeWidth={2}
              />
            </div>

            <div>
              <h1
                className="
                  text-2xl
                  font-bold
                  tracking-tight
                  text-slate-900
                  dark:text-white
                  sm:text-3xl
                "
              >
                {t("categories.title")}
              </h1>

              <p
                className="
                  mt-2
                  max-w-2xl
                  text-sm
                  leading-6
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {t("categories.description")}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsFormOpen(true)}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-slate-900
            px-4 py-3
            text-sm
            font-semibold
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
          <Plus
            size={18}
            strokeWidth={2.1}
          />

          {t("categories.addCategory")}
        </button>
      </div>

      {/* Category Summary */}
      <div
        className="
          mb-7
          grid
          gap-4
          sm:grid-cols-2
        "
      >
        {/* Expense Summary */}
        <div
          className="
            group
            rounded-2xl
            border border-slate-200
            bg-white
            p-5
            shadow-sm
            transition-all duration-200
            hover:-translate-y-0.5
            hover:shadow-md
            dark:border-slate-800
            dark:bg-slate-900
            dark:hover:shadow-black/20
          "
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p
                className="
                  text-sm
                  font-medium
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {t(
                  "categories.expenseCategories"
                )}
              </p>

              <p
                className="
                  mt-2
                  text-2xl
                  font-bold
                  tracking-tight
                  text-slate-900
                  dark:text-white
                "
              >
                {formatNumber(
                  expenseCategories.length,
                  language
                )}
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  leading-5
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {t(
                  "categories.expenseCategoriesDescription"
                )}
              </p>
            </div>

            <div
              className="
                flex h-10 w-10
                shrink-0
                items-center justify-center
                rounded-xl
                bg-rose-50
                text-rose-500
                transition-transform duration-200
                group-hover:scale-105
                dark:bg-rose-950/40
                dark:text-rose-400
              "
            >
              <Tags size={18} />
            </div>
          </div>
        </div>

        {/* Income Summary */}
        <div
          className="
            group
            rounded-2xl
            border border-slate-200
            bg-white
            p-5
            shadow-sm
            transition-all duration-200
            hover:-translate-y-0.5
            hover:shadow-md
            dark:border-slate-800
            dark:bg-slate-900
            dark:hover:shadow-black/20
          "
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p
                className="
                  text-sm
                  font-medium
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {t(
                  "categories.incomeCategories"
                )}
              </p>

              <p
                className="
                  mt-2
                  text-2xl
                  font-bold
                  tracking-tight
                  text-slate-900
                  dark:text-white
                "
              >
                {formatNumber(
                  incomeCategories.length,
                  language
                )}
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  leading-5
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {t(
                  "categories.incomeCategoriesDescription"
                )}
              </p>
            </div>

            <div
              className="
                flex h-10 w-10
                shrink-0
                items-center justify-center
                rounded-xl
                bg-emerald-50
                text-emerald-600
                transition-transform duration-200
                group-hover:scale-105
                dark:bg-emerald-950/40
                dark:text-emerald-400
              "
            >
              <Tags size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Expense Categories */}
      <section
        className="
          mb-7
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
        <div className="mb-5">
          <h2
            className="
              font-semibold
              tracking-tight
              text-slate-900
              dark:text-white
            "
          >
            {t(
              "categories.expenseCategories"
            )}
          </h2>

          <p
            className="
              mt-1
              text-xs
              leading-5
              text-slate-500
              dark:text-slate-400
            "
          >
            {t(
              "categories.expenseCategoriesDescription"
            )}
          </p>
        </div>

        {expenseCategories.length > 0 ? (
          <div
            className="
              grid
              gap-3
              sm:grid-cols-2
              xl:grid-cols-3
            "
          >
            {expenseCategories.map(
              (category, index) => (
                <div
                  key={category}
                  className="
                    animate-[categoryCardIn_350ms_ease-out_both]
                  "
                  style={{
                    animationDelay: `${Math.min(
                      index * 40,
                      200
                    )}ms`,
                  }}
                >
                  <CategoryCard
                    category={category}
                    type="expense"
                    onDelete={(
                      selectedCategory
                    ) =>
                      handleDeleteRequest(
                        selectedCategory,
                        "expense"
                      )
                    }
                  />
                </div>
              )
            )}
          </div>
        ) : (
          <div
            className="
              rounded-xl
              border border-dashed
              border-slate-200
              py-10
              text-center
              dark:border-slate-700
            "
          >
            <p
              className="
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              {t(
                "categories.noExpenseCategories"
              )}
            </p>
          </div>
        )}
      </section>

      {/* Income Categories */}
      <section
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
        <div className="mb-5">
          <h2
            className="
              font-semibold
              tracking-tight
              text-slate-900
              dark:text-white
            "
          >
            {t(
              "categories.incomeCategories"
            )}
          </h2>

          <p
            className="
              mt-1
              text-xs
              leading-5
              text-slate-500
              dark:text-slate-400
            "
          >
            {t(
              "categories.incomeCategoriesDescription"
            )}
          </p>
        </div>

        {incomeCategories.length > 0 ? (
          <div
            className="
              grid
              gap-3
              sm:grid-cols-2
              xl:grid-cols-3
            "
          >
            {incomeCategories.map(
              (category, index) => (
                <div
                  key={category}
                  className="
                    animate-[categoryCardIn_350ms_ease-out_both]
                  "
                  style={{
                    animationDelay: `${Math.min(
                      index * 40,
                      200
                    )}ms`,
                  }}
                >
                  <CategoryCard
                    category={category}
                    type="income"
                    onDelete={(
                      selectedCategory
                    ) =>
                      handleDeleteRequest(
                        selectedCategory,
                        "income"
                      )
                    }
                  />
                </div>
              )
            )}
          </div>
        ) : (
          <div
            className="
              rounded-xl
              border border-dashed
              border-slate-200
              py-10
              text-center
              dark:border-slate-700
            "
          >
            <p
              className="
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              {t(
                "categories.noIncomeCategories"
              )}
            </p>
          </div>
        )}
      </section>

      {/* Add Category Modal */}
      <CategoryForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(categoryToDelete)}
        title={t("categories.delete")}
        message={getDeleteMessage()}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />

      <style>{`
        @keyframes categoryCardIn {
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

export default Categories;
