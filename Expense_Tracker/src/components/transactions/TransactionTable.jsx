import {
  ArrowDownLeft,
  ArrowUpRight,
  Pencil,
  Trash2,
} from "lucide-react";

import { useExpense } from "../../context/ExpenseContext";
import { useLanguage } from "../../context/LanguageContext";

import { getCategoryLabel } from "../../utils/translations";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatNumber } from "../../utils/formatNumber";

function TransactionTable({
  transactions,
  onEdit,
  onDelete,
}) {
  const { settings } = useExpense();
  const { t, language } = useLanguage();

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    const [year, month, day] = date
      .split("-")
      .map(Number);

    if (!year || !month || !day) {
      return date;
    }

    if (language === "bn") {
      return `${formatNumber(
        day,
        language
      )}-${formatNumber(
        month,
        language
      )}-${formatNumber(year, language)}`;
    }

    return `${String(day).padStart(
      2,
      "0"
    )}-${String(month).padStart(
      2,
      "0"
    )}-${year}`;
  };

  const formatPaymentMethod = (
    paymentMethod
  ) => {
    if (!paymentMethod) {
      return "—";
    }

    const normalizedMethod =
      paymentMethod.trim().toLowerCase();

    if (language === "bn") {
      const paymentMethodMap = {
        cash: "নগদ",
        bkash: "বিকাশ",
        nagad: "নগদ",
        rocket: "রকেট",
        bank: "ব্যাংক",
        "bank transfer": "ব্যাংক ট্রান্সফার",
        card: "কার্ড",
        "credit card": "ক্রেডিট কার্ড",
        "debit card": "ডেবিট কার্ড",
      };

      return (
        paymentMethodMap[normalizedMethod] ||
        paymentMethod
      );
    }

    return paymentMethod;
  };

  return (
    <div
      className="
        hidden
        overflow-hidden
        rounded-2xl
        border border-slate-200
        bg-white
        shadow-sm
        transition-all duration-200
        hover:shadow-md
        dark:border-slate-800
        dark:bg-slate-900
        dark:hover:shadow-black/20
        md:block
      "
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-225">
          <thead>
            <tr
              className="
                border-b border-slate-200
                bg-slate-50/80
                dark:border-slate-800
                dark:bg-slate-800/60
              "
            >
              <th
                scope="col"
                className="
                  px-6 py-4
                  text-left
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[0.08em]
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {t("common.transaction")}
              </th>

              <th
                scope="col"
                className="
                  px-6 py-4
                  text-left
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[0.08em]
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {t("common.category")}
              </th>

              <th
                scope="col"
                className="
                  px-6 py-4
                  text-left
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[0.08em]
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {t("common.date")}
              </th>

              <th
                scope="col"
                className="
                  px-6 py-4
                  text-left
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[0.08em]
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {t("common.payment")}
              </th>

              <th
                scope="col"
                className="
                  px-6 py-4
                  text-right
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[0.08em]
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {t("common.amount")}
              </th>

              <th
                scope="col"
                className="
                  px-6 py-4
                  text-right
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[0.08em]
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {t("common.actions")}
              </th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((transaction) => {
              const isIncome =
                transaction.type === "income";

              const title =
                transaction.title?.trim() ||
                t("common.untitled");

              const category =
                transaction.category?.trim() ||
                t("common.uncategorized");

              const date =
                transaction.date || "—";

              const paymentMethod =
                transaction.paymentMethod?.trim() ||
                "—";

              return (
                <tr
                  key={transaction.id}
                  className="
                    group
                    border-b border-slate-100
                    transition-colors duration-150
                    last:border-b-0
                    hover:bg-slate-50/80
                    dark:border-slate-800
                    dark:hover:bg-slate-800/40
                  "
                >
                  {/* Transaction */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`
                          flex h-10 w-10
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
                          <ArrowUpRight
                            size={18}
                            strokeWidth={2}
                          />
                        ) : (
                          <ArrowDownLeft
                            size={18}
                            strokeWidth={2}
                          />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p
                          className="
                            max-w-55
                            truncate
                            text-sm
                            font-semibold
                            text-slate-900
                            dark:text-white
                          "
                          title={title}
                        >
                          {title}
                        </p>

                        {transaction.note && (
                          <p
                            className="
                              mt-1
                              max-w-55
                              truncate
                              text-xs
                              text-slate-400
                              dark:text-slate-500
                            "
                            title={transaction.note}
                          >
                            {transaction.note}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-6 py-4">
                    <span
                      className="
                        inline-flex
                        max-w-37.5
                        truncate
                        rounded-lg
                        bg-slate-100
                        px-2.5 py-1
                        text-xs
                        font-semibold
                        text-slate-600
                        dark:bg-slate-800
                        dark:text-slate-300
                      "
                      title={getCategoryLabel(
                        category,
                        t
                      )}
                    >
                      {getCategoryLabel(
                        category,
                        t
                      )}
                    </span>
                  </td>

                  {/* Date */}
                  <td
                    className="
                      whitespace-nowrap
                      px-6 py-4
                      text-sm
                      font-medium
                      text-slate-600
                      dark:text-slate-400
                    "
                  >
                    {formatDate(date)}
                  </td>

                  {/* Payment Method */}
                  <td
                    className="
                      whitespace-nowrap
                      px-6 py-4
                      text-sm
                      text-slate-600
                      dark:text-slate-400
                    "
                  >
                    {formatPaymentMethod(
                      paymentMethod
                    )}
                  </td>

                  {/* Amount */}
                  <td
                    className={`
                      whitespace-nowrap
                      px-6 py-4
                      text-right
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
                      settings.currency,
                      language
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div
                      className="
                        flex
                        justify-end
                        gap-0.5
                        opacity-70
                        transition-opacity duration-200
                        group-hover:opacity-100
                      "
                    >
                      <button
                        type="button"
                        onClick={() =>
                          onEdit(transaction)
                        }
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
                        aria-label={`${t(
                          "common.edit"
                        )} ${title}`}
                        title={t("common.edit")}
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onDelete(transaction)
                        }
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
                        aria-label={`${t(
                          "common.delete"
                        )} ${title}`}
                        title={t("common.delete")}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransactionTable;
