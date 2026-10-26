import { Search, X } from "lucide-react";

import { useLanguage } from "../../context/LanguageContext";

import { getCategoryLabel } from "../../utils/translations";

function TransactionFilters({
  search,
  setSearch,
  typeFilter,
  setTypeFilter,
  categoryFilter,
  setCategoryFilter,
  categories = [],
}) {
  const { t } = useLanguage();

  const hasFilters =
    search.trim() !== "" ||
    typeFilter !== "all" ||
    categoryFilter !== "all";

  const clearFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setCategoryFilter("all");
  };

  return (
    <div
      className="
        rounded-2xl
        border border-slate-200
        bg-white
        p-4
        shadow-sm
        transition-all duration-200
        hover:shadow-md
        dark:border-slate-800
        dark:bg-slate-900
        dark:hover:shadow-black/20
        sm:p-5
      "
    >
      {/* Filter controls */}
      <div
        className="
          grid gap-3
          md:grid-cols-[minmax(0,1fr)_auto_auto]
        "
      >
        {/* Search */}
        <div className="relative min-w-0">
          <Search
            size={18}
            strokeWidth={1.9}
            className="
              pointer-events-none
              absolute left-3.5 top-1/2
              -translate-y-1/2
              text-slate-400
              transition-colors
            "
          />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder={t(
              "filters.searchPlaceholder"
            )}
            aria-label={t(
              "filters.searchPlaceholder"
            )}
            className="
              w-full
              rounded-xl
              border border-slate-200
              bg-slate-50
              py-2.5 pl-10 pr-4
              text-sm
              text-slate-900
              outline-none
              transition-all duration-200
              placeholder:text-slate-400
              hover:border-slate-300
              hover:bg-white
              focus:border-slate-400
              focus:bg-white
              focus:ring-4
              focus:ring-slate-900/5
              dark:border-slate-700
              dark:bg-slate-800
              dark:text-white
              dark:hover:border-slate-600
              dark:hover:bg-slate-750
              dark:focus:border-slate-500
              dark:focus:bg-slate-800
              dark:focus:ring-white/5
            "
          />
        </div>

        {/* Type */}
        <select
          value={typeFilter}
          onChange={(event) =>
            setTypeFilter(event.target.value)
          }
          aria-label={t("filters.type")}
          className="
            min-w-0
            rounded-xl
            border border-slate-200
            bg-white
            px-4 py-2.5
            text-sm
            font-medium
            text-slate-700
            outline-none
            transition-all duration-200
            hover:border-slate-300
            focus:border-slate-400
            focus:ring-4
            focus:ring-slate-900/5
            dark:border-slate-700
            dark:bg-slate-800
            dark:text-slate-200
            dark:hover:border-slate-600
            dark:focus:border-slate-500
            dark:focus:ring-white/5
          "
        >
          <option value="all">
            {t("filters.allTypes")}
          </option>

          <option value="income">
            {t("filters.income")}
          </option>

          <option value="expense">
            {t("filters.expense")}
          </option>
        </select>

        {/* Category */}
        <select
          value={categoryFilter}
          onChange={(event) =>
            setCategoryFilter(event.target.value)
          }
          aria-label={t("filters.category")}
          className="
            min-w-0
            rounded-xl
            border border-slate-200
            bg-white
            px-4 py-2.5
            text-sm
            font-medium
            text-slate-700
            outline-none
            transition-all duration-200
            hover:border-slate-300
            focus:border-slate-400
            focus:ring-4
            focus:ring-slate-900/5
            dark:border-slate-700
            dark:bg-slate-800
            dark:text-slate-200
            dark:hover:border-slate-600
            dark:focus:border-slate-500
            dark:focus:ring-white/5
          "
        >
          <option value="all">
            {t("filters.allCategories")}
          </option>

          {categories.map((category) => (
            <option
              key={category}
              value={category}
            >
              {getCategoryLabel(category, t)}
            </option>
          ))}
        </select>
      </div>

      {/* Active filters / clear */}
      {hasFilters && (
        <div
          className="
            mt-3
            flex
            items-center
            justify-between
            gap-3
            border-t
            border-slate-100
            pt-3
            dark:border-slate-800
          "
        >
          <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
            {t("common.filtersApplied")}
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="
              inline-flex
              items-center
              gap-1.5
              rounded-lg
              px-2.5 py-1.5
              text-xs
              font-semibold
              text-slate-500
              transition-all duration-200
              hover:bg-slate-100
              hover:text-slate-900
              active:scale-95
              dark:text-slate-400
              dark:hover:bg-slate-800
              dark:hover:text-white
            "
          >
            <X size={14} />
            {t("common.clearFilters")}
          </button>
        </div>
      )}
    </div>
  );
}

export default TransactionFilters;
