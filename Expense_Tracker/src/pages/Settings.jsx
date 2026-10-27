import { useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Database,
  Download,
  Globe,
  Moon,
  Palette,
  RotateCcw,
  Sun,
  Upload,
  Wallet,
} from "lucide-react";

import { useExpense } from "../context/ExpenseContext";
import { useLanguage } from "../context/LanguageContext";
import { formatNumber } from "../utils/formatNumber";
import ConfirmDialog from "../components/common/ConfirmDialog";

function Settings() {
  const {
    settings,
    updateSettings,
    transactions,
    budgets,
    categories,
    resetAllData,
    importData,
  } = useExpense();

  const { language, setLanguage } = useLanguage();

  const fileInputRef = useRef(null);

  const [isResetDialogOpen, setIsResetDialogOpen] =
    useState(false);
  const [importMessage, setImportMessage] = useState("");
  const [importError, setImportError] = useState("");
  const [exportMessage, setExportMessage] = useState("");

  const clearMessages = () => {
    setImportMessage("");
    setImportError("");
    setExportMessage("");
  };

  const handleThemeChange = (theme) => {
    updateSettings({ theme });
    clearMessages();
  };

  const handleLanguageChange = (selectedLanguage) => {
    if (selectedLanguage !== "en" && selectedLanguage !== "bn") {
      return;
    }

    setLanguage(selectedLanguage);
    clearMessages();
  };

  const handleCurrencyChange = (event) => {
    updateSettings({ currency: event.target.value });
    clearMessages();
  };

  const handleExport = () => {
    clearMessages();

    try {
      const exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        transactions,
        budgets,
        categories,
        settings,
        language,
      };

      const blob = new Blob(
        [JSON.stringify(exportData, null, 2)],
        { type: "application/json" }
      );

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `spendly-backup-${new Date()
        .toISOString()
        .slice(0, 10)}.json`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
      setExportMessage("Backup exported successfully.");
    } catch (error) {
      console.error("Backup export failed:", error);
      setImportError("Could not export your backup. Please try again.");
    }
  };

  const handleImportClick = () => {
    clearMessages();
    fileInputRef.current?.click();
  };

  const handleImport = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    clearMessages();

    const reader = new FileReader();

    reader.onload = (loadEvent) => {
      try {
        const data = JSON.parse(loadEvent.target.result);

        const imported = importData(data);

        if (!imported) {
          setImportError(
            "Invalid backup file. Please select a valid Spendly backup."
          );
          return;
        }

        if (data.language === "en" || data.language === "bn") {
          setLanguage(data.language);
        }

        setImportMessage("Backup imported successfully.");
      } catch (error) {
        console.error("Backup import failed:", error);
        setImportError(
          "Invalid backup file. Please select a valid JSON backup."
        );
      }
    };

    reader.onerror = () => {
      setImportError("Could not read this file. Please try again.");
    };

    reader.readAsText(file);

    // Allow selecting the same file again.
    event.target.value = "";
  };

  const handleReset = () => {
    resetAllData();
    setLanguage("en");
    setIsResetDialogOpen(false);
    clearMessages();
  };

  const expenseCategoryCount = categories.expense?.length || 0;
  const incomeCategoryCount = categories.income?.length || 0;
  const totalCategoryCount =
    expenseCategoryCount + incomeCategoryCount;

  const cardClass =
    "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-black/20 sm:p-6";

  const sectionIconClass =
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";

  const sectionTitleClass =
    "font-semibold text-slate-900 dark:text-white";

  const descriptionClass =
    "mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400";

  const selectClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-200 hover:border-slate-300 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:border-slate-600";

  const secondaryButtonClass =
    "group flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm active:translate-y-0 active:scale-[0.98] dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800";

  return (
    <div className="mx-auto w-full max-w-5xl min-w-0">
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
            <Palette size={21} strokeWidth={1.9} />
          </div>

          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Settings
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Customize your experience, manage preferences, and back up your data.
            </p>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <section className={`${cardClass} mb-6`}>
        <div className="flex items-start gap-3">
          <div className={sectionIconClass}>
            <Palette size={19} strokeWidth={1.9} />
          </div>
          <div>
            <h2 className={sectionTitleClass}>Appearance</h2>
            <p className={descriptionClass}>
              Choose the theme that feels comfortable for you.
            </p>
          </div>
        </div>

        <div className="mt-5">
          <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-200">
            Theme
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                value: "light",
                label: "Light mode",
                description: "A bright and clean appearance.",
                Icon: Sun,
              },
              {
                value: "dark",
                label: "Dark mode",
                description: "A darker appearance for low-light environments.",
                Icon: Moon,
              },
            ].map(({ value, label, description, Icon }) => {
              const selected = settings.theme === value;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleThemeChange(value)}
                  aria-pressed={selected}
                  className={`group flex items-center gap-3 rounded-xl border p-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                    selected
                      ? "border-indigo-500 bg-indigo-50/70 shadow-sm dark:border-indigo-400 dark:bg-indigo-950/30"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:border-slate-600 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm transition-transform duration-200 group-hover:scale-105 dark:bg-slate-700 dark:text-slate-200">
                    <Icon size={19} strokeWidth={1.9} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {label}
                    </p>
                    <p className={descriptionClass}>{description}</p>
                  </div>

                  {selected && (
                    <CheckCircle2
                      size={18}
                      className="shrink-0 text-indigo-600 dark:text-indigo-400"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Preferences */}
      <section className={`${cardClass} mb-6`}>
        <div className="flex items-start gap-3">
          <div className={sectionIconClass}>
            <Globe size={19} strokeWidth={1.9} />
          </div>
          <div>
            <h2 className={sectionTitleClass}>Preferences</h2>
            <p className={descriptionClass}>
              Set your preferred language and currency.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="language"
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Language
            </label>
            <select
              id="language"
              value={language}
              onChange={(event) =>
                handleLanguageChange(event.target.value)
              }
              className={selectClass}
            >
              <option value="en">English</option>
              <option value="bn">বাংলা (Bangla)</option>
            </select>
            <p className={descriptionClass}>
              Choose the language displayed in the app.
            </p>
          </div>

          <div>
            <label
              htmlFor="currency"
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Currency
            </label>
            <select
              id="currency"
              value={settings.currency}
              onChange={handleCurrencyChange}
              className={selectClass}
            >
              <option value="BDT">BDT — ৳</option>
              <option value="USD">USD — $</option>
              <option value="EUR">EUR — €</option>
              <option value="GBP">GBP — £</option>
              <option value="INR">INR — ₹</option>
            </select>
            <p className={descriptionClass}>
              Choose the currency used for your expenses.
            </p>
          </div>
        </div>
      </section>

      {/* Data management */}
      <section className={`${cardClass} mb-6`}>
        <div className="flex items-start gap-3">
          <div className={sectionIconClass}>
            <Database size={19} strokeWidth={1.9} />
          </div>
          <div>
            <h2 className={sectionTitleClass}>Data management</h2>
            <p className={descriptionClass}>
              Export a backup or restore your data from a JSON file.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={handleExport}
            className={secondaryButtonClass}
          >
            <Download
              size={18}
              className="transition-transform duration-200 group-hover:-translate-y-0.5"
            />
            Export backup
          </button>

          <button
            type="button"
            onClick={handleImportClick}
            className={secondaryButtonClass}
          >
            <Upload
              size={18}
              className="transition-transform duration-200 group-hover:translate-y-0.5"
            />
            Import backup
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleImport}
            className="hidden"
          />
        </div>

        {exportMessage && (
          <div
            role="status"
            className="mt-3 flex items-start gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
          >
            <CheckCircle2 size={17} className="mt-0.5 shrink-0" />
            <p>{exportMessage}</p>
          </div>
        )}

        {importMessage && (
          <div
            role="status"
            className="mt-3 flex items-start gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
          >
            <CheckCircle2 size={17} className="mt-0.5 shrink-0" />
            <p>{importMessage}</p>
          </div>
        )}

        {importError && (
          <div
            role="alert"
            className="mt-3 flex items-start gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
          >
            <AlertTriangle size={17} className="mt-0.5 shrink-0" />
            <p>{importError}</p>
          </div>
        )}
      </section>

      {/* Storage overview */}
      <section className={`${cardClass} mb-6`}>
        <div className="flex items-start gap-3">
          <div className={sectionIconClass}>
            <Wallet size={19} strokeWidth={1.9} />
          </div>
          <div>
            <h2 className={sectionTitleClass}>Storage overview</h2>
            <p className={descriptionClass}>
              A quick overview of your currently stored records.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            {
              label: "Transactions",
              count: transactions.length,
            },
            {
              label: "Budgets",
              count: budgets.length,
            },
            {
              label: "Categories",
              count: totalCategoryCount,
            },
          ].map(({ label, count }) => (
            <div
              key={label}
              className="rounded-xl border border-slate-100 bg-slate-50/80 p-4 transition-colors duration-200 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/70 dark:hover:bg-slate-800"
            >
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {label}
              </p>
              <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {formatNumber(count, language)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Danger zone */}
      <section className="rounded-2xl border border-rose-200 bg-white p-5 shadow-sm dark:border-rose-950 dark:bg-slate-900 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
            <AlertTriangle size={19} strokeWidth={1.9} />
          </div>
          <div>
            <h2 className="font-semibold text-rose-700 dark:text-rose-400">
              Danger zone
            </h2>
            <p className={descriptionClass}>
              Be careful: resetting removes your saved app data.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-4 rounded-xl border border-rose-100 bg-rose-50/50 p-4 dark:border-rose-950 dark:bg-rose-950/20 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Reset all data
            </h3>
            <p className={descriptionClass}>
              Remove saved transactions, budgets, and related app data.
              Export a backup first if you may need it later.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsResetDialogOpen(true)}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-rose-700 hover:shadow-md active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
          >
            <RotateCcw size={17} />
            Reset all data
          </button>
        </div>
      </section>

      {/* Reset confirmation */}
      <ConfirmDialog
        isOpen={isResetDialogOpen}
        title="Reset all data?"
        message="This action will reset your saved data and cannot be undone. Make sure you have exported a backup if needed."
        onCancel={() => setIsResetDialogOpen(false)}
        onConfirm={handleReset}
      />
    </div>
  );
}

export default Settings;
