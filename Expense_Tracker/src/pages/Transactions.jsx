import { useMemo, useState } from "react";

import { Plus } from "lucide-react";

import { useExpense } from "../context/ExpenseContext";
import { useLanguage } from "../context/LanguageContext";

import { formatNumber } from "../utils/formatNumber";

import TransactionCard from "../components/transactions/TransactionCard";
import TransactionTable from "../components/transactions/TransactionTable";
import TransactionFilters from "../components/transactions/TransactionFilters";

function Transactions({
onAddTransaction,
onEditTransaction,
onDeleteTransaction,
}) {
const { transactions, categories } =
useExpense();

const { t, language } = useLanguage();

const [search, setSearch] = useState("");
const [typeFilter, setTypeFilter] =
useState("all");

const [categoryFilter, setCategoryFilter] =
useState("all");

const filterCategories = useMemo(() => {
const allCategories = [
...(categories?.expense || []),
...(categories?.income || []),
];


return [...new Set(allCategories)].sort(
  (a, b) =>
    a.localeCompare(b, undefined, {
      sensitivity: "base",
    })
);


}, [categories]);

const filteredTransactions = useMemo(() => {
const searchText = search
.toLowerCase()
.trim();


return transactions.filter((transaction) => {
  const title = String(
    transaction.title || ""
  ).toLowerCase();

  const category = String(
    transaction.category || ""
  ).toLowerCase();

  const paymentMethod = String(
    transaction.paymentMethod || ""
  ).toLowerCase();

  const matchesSearch =
    !searchText ||
    title.includes(searchText) ||
    category.includes(searchText) ||
    paymentMethod.includes(searchText);

  const matchesType =
    typeFilter === "all" ||
    transaction.type === typeFilter;

  const matchesCategory =
    categoryFilter === "all" ||
    transaction.category === categoryFilter;

  return (
    matchesSearch &&
    matchesType &&
    matchesCategory
  );
});


}, [
transactions,
search,
typeFilter,
categoryFilter,
]);

const resultCount = formatNumber(
filteredTransactions.length,
language
);

return ( <div>
{/* Header */} <div
     className="
       mb-6
       flex flex-col gap-4
       sm:flex-row
       sm:items-end
       sm:justify-between
     "
   > <div className="min-w-0"> <p
         className="
           mb-1
           text-sm font-medium
           text-slate-500
           dark:text-slate-400
         "
       >
{t("transactions.subtitle")} </p>

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
        {t("transactions.title")}
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
        {t("transactions.description")}
      </p>
    </div>

    <button
      type="button"
      onClick={onAddTransaction}
      className="
        flex
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
      <Plus size={18} />
      {t("transactions.addTransaction")}
    </button>
  </div>

  {/* Filters */}
  <TransactionFilters
    search={search}
    setSearch={setSearch}
    typeFilter={typeFilter}
    setTypeFilter={setTypeFilter}
    categoryFilter={categoryFilter}
    setCategoryFilter={setCategoryFilter}
    categories={filterCategories}
  />

  {/* Result Count */}
  <div className="my-5">
    <p className="text-sm text-slate-500 dark:text-slate-400">
      {t("transactions.showing")}{" "}
      <span className="font-semibold text-slate-900 dark:text-white">
        {resultCount}
      </span>{" "}
      {filteredTransactions.length === 1
        ? t("transactions.transaction")
        : t("transactions.transactions")}
    </p>
  </div>

  {/* Desktop Table */}
  {filteredTransactions.length > 0 && (
    <TransactionTable
      transactions={filteredTransactions}
      onEdit={onEditTransaction}
      onDelete={onDeleteTransaction}
    />
  )}

  {/* Mobile Cards */}
  {filteredTransactions.length > 0 && (
    <div
      className="
        rounded-2xl
        border border-slate-200
        bg-white
        px-5
        shadow-sm
        transition-all duration-200
        hover:shadow-md
        dark:border-slate-800
        dark:bg-slate-900
        dark:hover:shadow-black/20
        md:hidden
      "
    >
      {filteredTransactions.map(
        (transaction) => (
          <TransactionCard
            key={transaction.id}
            transaction={transaction}
            onEdit={onEditTransaction}
            onDelete={onDeleteTransaction}
          />
        )
      )}
    </div>
  )}

  {/* Empty State */}
  {filteredTransactions.length === 0 && (
    <div
      className="
        rounded-2xl
        border border-slate-200
        bg-white
        px-6 py-16
        text-center
        shadow-sm
        transition-colors
        dark:border-slate-800
        dark:bg-slate-900
      "
    >
      <div
        className="
          mx-auto
          flex h-12 w-12
          items-center justify-center
          rounded-2xl
          bg-slate-100
          text-slate-500
          transition-transform duration-200
          hover:scale-105
          dark:bg-slate-800
          dark:text-slate-400
        "
      >
        <Plus size={22} />
      </div>

      <h3
        className="
          mt-4
          text-sm
          font-semibold
          text-slate-900
          dark:text-white
        "
      >
        {t("transactions.noTransactions")}
      </h3>

      <p
        className="
          mx-auto
          mt-2
          max-w-sm
          text-sm
          leading-6
          text-slate-500
          dark:text-slate-400
        "
      >
        {t("transactions.changeFilters")}
      </p>
    </div>
  )}
</div>


);
}

export default Transactions;
