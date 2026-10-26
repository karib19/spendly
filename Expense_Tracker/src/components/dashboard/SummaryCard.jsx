
import {
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
} from "lucide-react";

import { useExpense } from "../../context/ExpenseContext";
import { useLanguage } from "../../context/LanguageContext";
import { formatCurrency } from "../../utils/formatCurrency";

function SummaryCard({ type, amount = 0 }) {
  const { settings } = useExpense();
  const { t, language } = useLanguage();

  const safeAmount = Number.isFinite(Number(amount))
    ? Number(amount)
    : 0;

  const cardConfig = {
    balance: {
      label: t("dashboard.totalBalance"),
      description: t("dashboard.incomeMinusExpenses"),
      icon: Wallet,
      iconClass:
        "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
      amountClass:
        safeAmount >= 0
          ? "text-slate-900 dark:text-white"
          : "text-rose-600 dark:text-rose-400",
    },

    income: {
      label: t("dashboard.totalIncome"),
      description: t("dashboard.totalMoneyReceived"),
      icon: ArrowUpRight,
      iconClass:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
      amountClass:
        "text-emerald-600 dark:text-emerald-400",
    },

    expense: {
      label: t("dashboard.totalExpenses"),
      description: t("dashboard.totalMoneySpent"),
      icon: ArrowDownLeft,
      iconClass:
        "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400",
      amountClass:
        "text-rose-600 dark:text-rose-400",
    },
  };

  const config = cardConfig[type] || cardConfig.balance;
  const Icon = config.icon;

  return (
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
        sm:p-6
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {config.label}
          </p>

          <h3
            className={`
              mt-3
              wrap-break-words
              text-2xl
              font-bold
              tracking-tight
              sm:text-[26px]
              ${config.amountClass}
            `}
          >
            {formatCurrency(
              safeAmount,
              settings?.currency || "BDT",
              language
            )}
          </h3>
        </div>

        <div
          className={`
            flex h-10 w-10 shrink-0 items-center justify-center
            rounded-xl
            transition-transform duration-200
            group-hover:scale-105
            ${config.iconClass}
          `}
        >
          <Icon size={20} strokeWidth={2} />
        </div>
      </div>

      <p className="mt-2.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
        {config.description}
      </p>
    </div>
  );
}

export default SummaryCard;
