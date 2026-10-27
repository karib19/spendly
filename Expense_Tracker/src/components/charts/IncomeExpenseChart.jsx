import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useExpense } from "../../context/ExpenseContext";
import { useLanguage } from "../../context/LanguageContext";
import { parseTransactionDate } from "../../utils/transactionDate";

function IncomeExpenseChart() {
  const {
    transactions = [],
    transactionsLoading,
    transactionsError,
    settings,
  } = useExpense();

  const { language } = useLanguage();

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
    String(
      transaction.type ?? transaction.transaction_type ?? ""
    )
      .toLowerCase()
      .trim();

  const now = new Date();

  const data = Array.from({ length: 6 }, (_, index) => {
    const monthDate = new Date(
      now.getFullYear(),
      now.getMonth() - 5 + index,
      1
    );

    const monthTransactions = transactions.filter((transaction) => {
      const date = parseTransactionDate(transaction.date);

      return (
        date &&
        date.getFullYear() === monthDate.getFullYear() &&
        date.getMonth() === monthDate.getMonth()
      );
    });

    const income = monthTransactions.reduce((sum, transaction) => {
      const amount = Number(transaction.amount);

      if (
        getTransactionType(transaction) === "income" &&
        Number.isFinite(amount) &&
        amount > 0
      ) {
        return sum + amount;
      }

      return sum;
    }, 0);

    const expense = monthTransactions.reduce((sum, transaction) => {
      const amount = Number(transaction.amount);

      if (
        getTransactionType(transaction) === "expense" &&
        Number.isFinite(amount) &&
        amount > 0
      ) {
        return sum + amount;
      }

      return sum;
    }, 0);

    return {
      month: monthDate.toLocaleDateString(
        isBangla ? "bn-BD" : "en-US",
        { month: "short" }
      ),
      income,
      expense,
    };
  });

  const hasData = data.some(
    (item) => item.income > 0 || item.expense > 0
  );

  const axisColor = isDark ? "#94a3b8" : "#64748b";
  const gridColor = isDark ? "#334155" : "#e2e8f0";

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
          Income vs. Expenses
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Compare your monthly income and expenses over the last six months.
        </p>
      </div>

      {transactionsLoading ? (
        <div className="flex h-72 items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700 dark:border-slate-600 dark:border-t-white" />
            Loading report...
          </div>
        </div>
      ) : transactionsError ? (
        <div className="flex h-72 items-center justify-center text-center">
          <p className="max-w-sm text-sm text-rose-600 dark:text-rose-400">
            {String(transactionsError)}
          </p>
        </div>
      ) : !hasData ? (
        <div className="flex h-72 items-center justify-center text-center text-sm text-slate-500 dark:text-slate-400">
          No income or expense data available for the last six months.
        </div>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 8, right: 4, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                stroke={gridColor}
                strokeDasharray="4 4"
                vertical={false}
              />

              <XAxis
                dataKey="month"
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

              <Legend />

              <Bar
                dataKey="income"
                name="Income"
                fill="#10b981"
                radius={[5, 5, 0, 0]}
                maxBarSize={32}
              />

              <Bar
                dataKey="expense"
                name="Expenses"
                fill="#f43f5e"
                radius={[5, 5, 0, 0]}
                maxBarSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default IncomeExpenseChart;