
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useExpense } from "../../context/ExpenseContext";
import { useLanguage } from "../../context/LanguageContext";
import { parseTransactionDate } from "../../utils/transactionDate";

function SpendingTrendChart() {
  const {
    transactions = [],
    transactionsLoading,
    transactionsError,
    settings,
  } = useExpense();

  const { t, language } = useLanguage();
  const isDark = settings?.theme === "dark";
  const currency = settings?.currency || "BDT";
  const isBangla = language === "bn";

  const formatCurrency = (amount) =>
    new Intl.NumberFormat(isBangla ? "bn-BD" : "en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);

  const getTransactionType = (transaction) =>
    String(transaction.type ?? transaction.transaction_type ?? "")
      .toLowerCase()
      .trim();

  const today = new Date();

  const data = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - (6 - index)
    );

    const amount = transactions.reduce((sum, transaction) => {
      const date = parseTransactionDate(transaction.date);
      const transactionAmount = Number(transaction.amount);

      if (
        date &&
        getTransactionType(transaction) === "expense" &&
        date.getFullYear() === day.getFullYear() &&
        date.getMonth() === day.getMonth() &&
        date.getDate() === day.getDate() &&
        Number.isFinite(transactionAmount) &&
        transactionAmount > 0
      ) {
        return sum + transactionAmount;
      }

      return sum;
    }, 0);

    return {
      day: day.toLocaleDateString(
        isBangla ? "bn-BD" : "en-US",
        { weekday: "short" }
      ),
      amount,
    };
  });

  const hasData = data.some((item) => item.amount > 0);
  const gridColor = isDark ? "#334155" : "#e2e8f0";
  const axisColor = isDark ? "#94a3b8" : "#64748b";

  const tooltipStyle = {
    backgroundColor: isDark ? "#1e293b" : "#ffffff",
    border: `1px solid ${gridColor}`,
    borderRadius: "12px",
    color: isDark ? "#f8fafc" : "#0f172a",
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {t("reports.spendingTrend")}
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {t("reports.spendingTrendDescription")}
        </p>
      </div>

      {transactionsLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700 dark:border-slate-600 dark:border-t-white" />
            {isBangla ? "রিপোর্ট লোড হচ্ছে..." : "Loading report..."}
          </div>
        </div>
      ) : transactionsError ? (
        <div className="flex h-64 items-center justify-center text-center">
          <p className="max-w-sm text-sm text-rose-600 dark:text-rose-400">
            {transactionsError}
          </p>
        </div>
      ) : !hasData ? (
        <div className="flex h-64 items-center justify-center text-center text-sm text-slate-500 dark:text-slate-400">
          {t("reports.noData")}
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 8, right: 4, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="spendingTrendGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke={gridColor}
                strokeDasharray="4 4"
                vertical={false}
              />

              <XAxis
                dataKey="day"
                tick={{ fill: axisColor, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{ fill: axisColor, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) =>
                  new Intl.NumberFormat(isBangla ? "bn-BD" : "en-US", {
                    notation: "compact",
                    maximumFractionDigits: 1,
                  }).format(value)
                }
                width={48}
              />

              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value) => formatCurrency(Number(value))}
              />

              <Area
                type="monotone"
                dataKey="amount"
                name={t("transactions.expense")}
                stroke="#f43f5e"
                strokeWidth={2.5}
                fill="url(#spendingTrendGradient)"
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default SpendingTrendChart;
