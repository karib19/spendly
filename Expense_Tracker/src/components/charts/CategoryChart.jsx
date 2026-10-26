
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useExpense } from "../../context/ExpenseContext";
import { useLanguage } from "../../context/LanguageContext";
import { parseTransactionDate } from "../../utils/transactionDate";

const COLORS = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#f43f5e",
  "#06b6d4",
  "#8b5cf6",
  "#ec4899",
  "#64748b",
];

// Translate category names for display only.
// Backend category values remain unchanged.
const CATEGORY_TRANSLATIONS = {
  food: "খাবার",
  health: "স্বাস্থ্য",
  healthcare: "স্বাস্থ্যসেবা",
  medical: "চিকিৎসা",
  transport: "যাতায়াত",
  transportation: "যাতায়াত",
  shopping: "কেনাকাটা",
  education: "শিক্ষা",
  entertainment: "বিনোদন",
  rent: "বাড়িভাড়া",
  housing: "বাসস্থান",
  bills: "বিল",
  utilities: "ইউটিলিটি বিল",
  groceries: "মুদি ও নিত্যপ্রয়োজনীয় পণ্য",
  restaurant: "রেস্তোরাঁ",
  restaurants: "রেস্তোরাঁ",
  travel: "ভ্রমণ",
  salary: "বেতন",
  freelance: "ফ্রিল্যান্স আয়",
  business: "ব্যবসা",
  investment: "বিনিয়োগ",
  investments: "বিনিয়োগ",
  savings: "সঞ্চয়",
  gifts: "উপহার",
  family: "পরিবার",
  personal: "ব্যক্তিগত",
  other: "অন্যান্য",
};

function getCategoryLabel(category, language) {
  if (!category) {
    return language === "bn" ? "অন্যান্য" : "Other";
  }

  if (language !== "bn") {
    return category;
  }

  const normalizedCategory = String(category)
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");

  return (
    CATEGORY_TRANSLATIONS[normalizedCategory] ||
    CATEGORY_TRANSLATIONS[normalizedCategory.replace(/\s+/g, "")] ||
    category
  );
}

function CategoryChart() {
  const {
    transactions,
    transactionsLoading,
    transactionsError,
    settings,
  } = useExpense();

  const { t, language } = useLanguage();
  const isDark = settings?.theme === "dark";
  const currency = settings?.currency || "BDT";

  const formatCurrency = (amount) =>
    new Intl.NumberFormat(language === "bn" ? "bn-BD" : "en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);

  const now = new Date();

  const categoryTotals = transactions.reduce((totals, transaction) => {
    const date = parseTransactionDate(transaction.date);
    const amount = Number(transaction.amount);

    if (
      !date ||
      transaction.type !== "expense" ||
      date.getFullYear() !== now.getFullYear() ||
      date.getMonth() !== now.getMonth() ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return totals;
    }

    const category = String(transaction.category || "Other").trim() || "Other";

    totals[category] = (totals[category] || 0) + amount;

    return totals;
  }, {});

  const data = Object.entries(categoryTotals)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  const total = data.reduce((sum, item) => sum + item.amount, 0);
  const hasData = total > 0;

  const getLabel = (category) => getCategoryLabel(category, language);

  const tooltipStyle = {
    backgroundColor: isDark ? "#1e293b" : "#ffffff",
    border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
    borderRadius: "12px",
    color: isDark ? "#f8fafc" : "#0f172a",
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {t("reports.categoryBreakdown")}
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {t("reports.categoryBreakdownDescription")}
        </p>
      </div>

      {transactionsLoading ? (
        <div className="flex h-72 items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700 dark:border-slate-600 dark:border-t-white" />
            {language === "bn" ? "রিপোর্ট লোড হচ্ছে..." : "Loading report..."}
          </div>
        </div>
      ) : transactionsError ? (
        <div className="flex h-72 items-center justify-center text-center">
          <p className="max-w-sm text-sm text-rose-600 dark:text-rose-400">
            {transactionsError}
          </p>
        </div>
      ) : !hasData ? (
        <div className="flex h-72 items-center justify-center text-center text-sm text-slate-500 dark:text-slate-400">
          {t("reports.noData")}
        </div>
      ) : (
        <>
          <div className="relative h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={68}
                  outerRadius={100}
                  paddingAngle={3}
                  stroke="none"
                >
                  {data.map((item, index) => (
                    <Cell
                      key={item.category}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => formatCurrency(Number(value))}
                  labelFormatter={(label) => getLabel(label)}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {t("reports.total")}
              </span>

              <span className="mt-1 max-w-37.5 truncate text-xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(total)}
              </span>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {data.map((item, index) => {
              const percentage = (item.amount / total) * 100;

              return (
                <div
                  key={item.category}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    />

                    <span className="truncate text-sm text-slate-600 dark:text-slate-300">
                      {getLabel(item.category)}
                    </span>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-xs text-slate-400">
                      {percentage.toLocaleString(
                        language === "bn" ? "bn-BD" : "en-US",
                        { maximumFractionDigits: 1 }
                      )}
                      %
                    </span>

                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {formatCurrency(item.amount)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}

export default CategoryChart;
