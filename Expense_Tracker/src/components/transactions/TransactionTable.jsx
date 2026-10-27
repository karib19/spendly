import {
  ArrowDownLeft,
  ArrowUpRight,
  Pencil,
  Trash2,
} from "lucide-react";

import { useExpense } from "../../context/ExpenseContext";
import { useLanguage } from "../../context/LanguageContext";

import { formatCurrency } from "../../utils/formatCurrency";
import { formatNumber } from "../../utils/formatNumber";

function TransactionTable({ transactions = [], onEdit, onDelete }) {
  const { settings = {} } = useExpense();
  const { language } = useLanguage();

  const isBangla = language === "bn";

  const formatDate = (date) => {
    if (!date) return "—";

    const parts = String(date).split("-");
    if (parts.length < 3) return date;

    const [year, month, day] = parts.map(Number);

    if (!year || !month || !day) return date;

    if (isBangla) {
      return `${formatNumber(day, language)}-${formatNumber(
        month,
        language
      )}-${formatNumber(year, language)}`;
    }

    return `${String(day).padStart(2, "0")}-${String(month).padStart(
      2,
      "0"
    )}-${year}`;
  };

  const formatPaymentMethod = (paymentMethod) => {
    if (!paymentMethod) return "—";

    const normalizedMethod = String(paymentMethod).trim().toLowerCase();

    if (!isBangla) return paymentMethod;

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
      mobile_banking: "মোবাইল ব্যাংকিং",
      mobile: "মোবাইল",
      other: "অন্যান্য",
    };

    return paymentMethodMap[normalizedMethod] || paymentMethod;
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
      lang={isBangla ? "bn" : "en"}
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
              {[
                "Transaction",
                "Category",
                "Date",
                "Payment",
                "Amount",
                "Actions",
              ].map((heading) => (
                <th
                  key={heading}
                  scope="col"
                  className={`
                    px-6 py-4
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-[0.08em]
                    text-slate-500
                    dark:text-slate-400
                    ${heading === "Amount" || heading === "Actions"
                      ? "text-right"
                      : "text-left"}
                  `}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {transactions.map((transaction, index) => {
              const isIncome = transaction.type === "income";
              const title = transaction.title?.trim() || "Untitled";
              const category = transaction.category?.trim() || "Uncategorized";

              const date = transaction.date || "—";

              const paymentMethod =
                transaction.paymentMethod ??
                transaction.payment_method ??
                "";

              const note =
                transaction.note ??
                transaction.description ??
                "";

              return (
                <tr
                  key={
                    transaction.id ??
                    `${transaction.date}-${transaction.title}-${index}`
                  }
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
                          <ArrowUpRight size={18} strokeWidth={2} />
                        ) : (
                          <ArrowDownLeft size={18} strokeWidth={2} />
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

                        {note && (
                          <p
                            className="
                              mt-1
                              max-w-55
                              truncate
                              text-xs
                              text-slate-400
                              dark:text-slate-500
                            "
                            title={note}
                          >
                            {note}
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
                      title={category}
                    >
                      {category}
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
                    {formatPaymentMethod(paymentMethod)}
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
                      settings.currency || "BDT",
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