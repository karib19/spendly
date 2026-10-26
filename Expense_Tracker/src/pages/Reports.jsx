import { BarChart3 } from "lucide-react";

import { useLanguage } from "../context/LanguageContext";

import IncomeExpenseChart from "../components/charts/IncomeExpenseChart";
import SpendingTrendChart from "../components/charts/SpendingTrendChart";
import CategoryChart from "../components/charts/CategoryChart";

function Reports() {
const { t } = useLanguage();

return ( <div>
{/* Header */} <div className="mb-8"> <div className="flex items-start gap-3"> <div
         className="
           flex
           h-11 w-11
           shrink-0
           items-center
           justify-center
           rounded-xl
           bg-slate-100
           text-slate-700
           dark:bg-slate-800
           dark:text-slate-300
         "
       > <BarChart3
           size={21}
           strokeWidth={1.9}
         /> </div>

      <div className="min-w-0">
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
          {t("reports.title")}
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
          {t("reports.description")}
        </p>
      </div>
    </div>
  </div>

  {/* Income vs Expense */}
  <div>
    <IncomeExpenseChart />
  </div>

  {/* Spending Trend + Category Breakdown */}
  <div className="mt-6 grid gap-6 xl:grid-cols-2">
    <SpendingTrendChart />
    <CategoryChart />
  </div>
</div>


);
}

export default Reports;
