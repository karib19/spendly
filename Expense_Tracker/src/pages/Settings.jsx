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

const { language, setLanguage, t } =
useLanguage();

const fileInputRef = useRef(null);

const [isResetDialogOpen, setIsResetDialogOpen] =
useState(false);

const [importMessage, setImportMessage] =
useState("");

const [importError, setImportError] =
useState("");

const [exportMessage, setExportMessage] =
useState("");

const clearMessages = () => {
setImportMessage("");
setImportError("");
setExportMessage("");
};

const handleThemeChange = (theme) => {
updateSettings({ theme });
clearMessages();
};

const handleLanguageChange = (
selectedLanguage
) => {
if (
selectedLanguage !== "en" &&
selectedLanguage !== "bn"
) {
return;
}


setLanguage(selectedLanguage);
clearMessages();


};

const handleCurrencyChange = (event) => {
updateSettings({
currency: event.target.value,
});


clearMessages();


};

const handleExport = () => {
clearMessages();


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
  {
    type: "application/json",
  }
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

setExportMessage(
  t("settings.dataExported")
);


};

const handleImportClick = () => {
clearMessages();


fileInputRef.current?.click();


};

const handleImport = (event) => {
const file = event.target.files?.[0];


if (!file) {
  return;
}

clearMessages();

const reader = new FileReader();

reader.onload = (loadEvent) => {
  try {
    const data = JSON.parse(
      loadEvent.target.result
    );

    const imported = importData(data);

    if (!imported) {
      setImportError(
        t("settings.invalidBackup")
      );

      return;
    }

    if (
      data.language === "en" ||
      data.language === "bn"
    ) {
      setLanguage(data.language);
    }

    setImportMessage(
      t("settings.importSuccess")
    );
  } catch {
    setImportError(
      t("settings.invalidBackup")
    );
  }
};

reader.onerror = () => {
  setImportError(
    t("settings.invalidBackup")
  );
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

const expenseCategoryCount =
categories.expense?.length || 0;

const incomeCategoryCount =
categories.income?.length || 0;

const totalCategoryCount =
expenseCategoryCount +
incomeCategoryCount;

return ( <div>
{/* Header */} <div className="mb-8"> <div className="flex items-start gap-3"> <div
         className="
           flex h-11 w-11 shrink-0
           items-center justify-center
           rounded-xl
           bg-slate-100
           text-slate-700
           dark:bg-slate-800
           dark:text-slate-300
         "
       > <Palette
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
          {t("settings.title")}
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
          {t("settings.description")}
        </p>
      </div>
    </div>
  </div>

  {/* Appearance */}
  <section
    className="
      mb-6
      rounded-2xl
      border border-slate-200
      bg-white
      p-5
      shadow-sm
      transition-all duration-200
      hover:shadow-md
      dark:border-slate-800
      dark:bg-slate-900
      dark:hover:shadow-black/20
      sm:p-6
    "
  >
    <div className="flex items-start gap-3">
      <div
        className="
          flex h-10 w-10 shrink-0
          items-center justify-center
          rounded-xl
          bg-slate-100
          text-slate-700
          dark:bg-slate-800
          dark:text-slate-300
        "
      >
        <Palette
          size={19}
          strokeWidth={1.9}
        />
      </div>

      <div>
        <h2 className="font-semibold text-slate-900 dark:text-white">
          {t("settings.appearance")}
        </h2>

        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
          {t(
            "settings.appearanceDescription"
          )}
        </p>
      </div>
    </div>

    <div className="mt-5">
      <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-200">
        {t("settings.theme")}
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {/* Light */}
        <button
          type="button"
          onClick={() =>
            handleThemeChange("light")
          }
          aria-pressed={
            settings.theme === "light"
          }
          className={`
            group
            flex items-center gap-3
            rounded-xl
            border
            p-4
            text-left
            transition-all duration-200
            ${
              settings.theme === "light"
                ? "border-slate-900 bg-slate-50 shadow-sm dark:border-slate-100 dark:bg-slate-800"
                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:border-slate-600 dark:hover:bg-slate-800"
            }
          `}
        >
          <div
            className="
              flex h-10 w-10 shrink-0
              items-center justify-center
              rounded-xl
              bg-white
              text-slate-700
              shadow-sm
              transition-transform duration-200
              group-hover:scale-105
              dark:bg-slate-700
              dark:text-slate-200
            "
          >
            <Sun
              size={19}
              strokeWidth={1.9}
            />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {t("settings.light")}
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
              {t(
                "settings.lightDescription"
              )}
            </p>
          </div>
        </button>

        {/* Dark */}
        <button
          type="button"
          onClick={() =>
            handleThemeChange("dark")
          }
          aria-pressed={
            settings.theme === "dark"
          }
          className={`
            group
            flex items-center gap-3
            rounded-xl
            border
            p-4
            text-left
            transition-all duration-200
            ${
              settings.theme === "dark"
                ? "border-slate-900 bg-slate-50 shadow-sm dark:border-slate-100 dark:bg-slate-800"
                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:border-slate-600 dark:hover:bg-slate-800"
            }
          `}
        >
          <div
            className="
              flex h-10 w-10 shrink-0
              items-center justify-center
              rounded-xl
              bg-slate-100
              text-slate-700
              transition-transform duration-200
              group-hover:scale-105
              dark:bg-slate-700
              dark:text-slate-200
            "
          >
            <Moon
              size={19}
              strokeWidth={1.9}
            />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {t("settings.dark")}
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
              {t(
                "settings.darkDescription"
              )}
            </p>
          </div>
        </button>
      </div>
    </div>
  </section>

  {/* Preferences */}
  <section
    className="
      mb-6
      rounded-2xl
      border border-slate-200
      bg-white
      p-5
      shadow-sm
      transition-all duration-200
      hover:shadow-md
      dark:border-slate-800
      dark:bg-slate-900
      dark:hover:shadow-black/20
      sm:p-6
    "
  >
    <div className="flex items-start gap-3">
      <div
        className="
          flex h-10 w-10 shrink-0
          items-center justify-center
          rounded-xl
          bg-slate-100
          text-slate-700
          dark:bg-slate-800
          dark:text-slate-300
        "
      >
        <Globe
          size={19}
          strokeWidth={1.9}
        />
      </div>

      <div>
        <h2 className="font-semibold text-slate-900 dark:text-white">
          {t("settings.preferences")}
        </h2>

        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
          {t(
            "settings.preferencesDescription"
          )}
        </p>
      </div>
    </div>

    <div className="mt-5 grid gap-5 sm:grid-cols-2">
      {/* Language */}
      <div>
        <label
          htmlFor="language"
          className="
            mb-2 block
            text-sm font-medium
            text-slate-700
            dark:text-slate-200
          "
        >
          {t("settings.language")}
        </label>

        <select
          id="language"
          value={language}
          onChange={(event) =>
            handleLanguageChange(
              event.target.value
            )
          }
          className="
            w-full
            rounded-xl
            border border-slate-200
            bg-white
            px-4 py-3
            text-sm
            text-slate-900
            outline-none
            transition-all duration-200
            hover:border-slate-300
            focus:border-slate-400
            focus:ring-4
            focus:ring-slate-900/5
            dark:border-slate-700
            dark:bg-slate-800
            dark:text-white
            dark:hover:border-slate-600
            dark:focus:border-slate-500
            dark:focus:ring-white/5
          "
        >
          <option value="en">
            {t("settings.english")}
          </option>

          <option value="bn">
            {t("settings.bangla")}
          </option>
        </select>
      </div>

      {/* Currency */}
      <div>
        <label
          htmlFor="currency"
          className="
            mb-2 block
            text-sm font-medium
            text-slate-700
            dark:text-slate-200
          "
        >
          {t("settings.currency")}
        </label>

        <select
          id="currency"
          value={settings.currency}
          onChange={handleCurrencyChange}
          className="
            w-full
            rounded-xl
            border border-slate-200
            bg-white
            px-4 py-3
            text-sm
            text-slate-900
            outline-none
            transition-all duration-200
            hover:border-slate-300
            focus:border-slate-400
            focus:ring-4
            focus:ring-slate-900/5
            dark:border-slate-700
            dark:bg-slate-800
            dark:text-white
            dark:hover:border-slate-600
            dark:focus:border-slate-500
            dark:focus:ring-white/5
          "
        >
          <option value="BDT">
            BDT — ৳
          </option>

          <option value="USD">
            USD — $
          </option>

          <option value="EUR">
            EUR — €
          </option>

          <option value="GBP">
            GBP — £
          </option>

          <option value="INR">
            INR — ₹
          </option>
        </select>
      </div>
    </div>
  </section>

  {/* Data Management */}
  <section
    className="
      mb-6
      rounded-2xl
      border border-slate-200
      bg-white
      p-5
      shadow-sm
      transition-all duration-200
      hover:shadow-md
      dark:border-slate-800
      dark:bg-slate-900
      dark:hover:shadow-black/20
      sm:p-6
    "
  >
    <div className="flex items-start gap-3">
      <div
        className="
          flex h-10 w-10 shrink-0
          items-center justify-center
          rounded-xl
          bg-slate-100
          text-slate-700
          dark:bg-slate-800
          dark:text-slate-300
        "
      >
        <Database
          size={19}
          strokeWidth={1.9}
        />
      </div>

      <div>
        <h2 className="font-semibold text-slate-900 dark:text-white">
          {t("settings.dataManagement")}
        </h2>

        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
          {t(
            "settings.dataManagementDescription"
          )}
        </p>
      </div>
    </div>

    <div className="mt-5 grid gap-3 sm:grid-cols-2">
      <button
        type="button"
        onClick={handleExport}
        className="
          group
          flex items-center justify-center gap-2
          rounded-xl
          border border-slate-200
          px-4 py-3
          text-sm font-semibold
          text-slate-700
          transition-all duration-200
          hover:-translate-y-0.5
          hover:border-slate-300
          hover:bg-slate-50
          hover:shadow-sm
          active:translate-y-0
          active:scale-[0.98]
          dark:border-slate-700
          dark:text-slate-200
          dark:hover:border-slate-600
          dark:hover:bg-slate-800
        "
      >
        <Download
          size={18}
          className="transition-transform duration-200 group-hover:-translate-y-0.5"
        />

        {t("settings.exportData")}
      </button>

      <button
        type="button"
        onClick={handleImportClick}
        className="
          group
          flex items-center justify-center gap-2
          rounded-xl
          border border-slate-200
          px-4 py-3
          text-sm font-semibold
          text-slate-700
          transition-all duration-200
          hover:-translate-y-0.5
          hover:border-slate-300
          hover:bg-slate-50
          hover:shadow-sm
          active:translate-y-0
          active:scale-[0.98]
          dark:border-slate-700
          dark:text-slate-200
          dark:hover:border-slate-600
          dark:hover:bg-slate-800
        "
      >
        <Upload
          size={18}
          className="transition-transform duration-200 group-hover:translate-y-0.5"
        />

        {t("settings.importData")}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleImport}
        className="hidden"
      />
    </div>

    {/* Export Success */}
    {exportMessage && (
      <div
        className="
          mt-3
          flex items-start gap-2
          rounded-xl
          bg-emerald-50
          px-4 py-3
          text-sm font-medium
          text-emerald-700
          dark:bg-emerald-950/40
          dark:text-emerald-400
        "
      >
        <CheckCircle2
          size={17}
          className="mt-0.5 shrink-0"
        />

        <p>{exportMessage}</p>
      </div>
    )}

    {/* Import Success */}
    {importMessage && (
      <div
        className="
          mt-3
          flex items-start gap-2
          rounded-xl
          bg-emerald-50
          px-4 py-3
          text-sm font-medium
          text-emerald-700
          dark:bg-emerald-950/40
          dark:text-emerald-400
        "
      >
        <CheckCircle2
          size={17}
          className="mt-0.5 shrink-0"
        />

        <p>{importMessage}</p>
      </div>
    )}

    {/* Import Error */}
    {importError && (
      <div
        className="
          mt-3
          flex items-start gap-2
          rounded-xl
          bg-rose-50
          px-4 py-3
          text-sm font-medium
          text-rose-700
          dark:bg-rose-950/40
          dark:text-rose-400
        "
      >
        <AlertTriangle
          size={17}
          className="mt-0.5 shrink-0"
        />

        <p>{importError}</p>
      </div>
    )}
  </section>

  {/* Storage Overview */}
  <section
    className="
      mb-6
      rounded-2xl
      border border-slate-200
      bg-white
      p-5
      shadow-sm
      transition-all duration-200
      hover:shadow-md
      dark:border-slate-800
      dark:bg-slate-900
      dark:hover:shadow-black/20
      sm:p-6
    "
  >
    <div className="flex items-start gap-3">
      <div
        className="
          flex h-10 w-10 shrink-0
          items-center justify-center
          rounded-xl
          bg-slate-100
          text-slate-700
          dark:bg-slate-800
          dark:text-slate-300
        "
      >
        <Wallet
          size={19}
          strokeWidth={1.9}
        />
      </div>

      <div>
        <h2 className="font-semibold text-slate-900 dark:text-white">
          {t("settings.storageOverview")}
        </h2>

        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
          {t(
            "settings.storageOverviewDescription"
          )}
        </p>
      </div>
    </div>

    <div className="mt-5 grid gap-3 sm:grid-cols-3">
      {/* Transactions */}
      <div
        className="
          rounded-xl
          bg-slate-50
          p-4
          transition-colors
          hover:bg-slate-100
          dark:bg-slate-800
          dark:hover:bg-slate-750
        "
      >
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {t("settings.transactionsStored")}
        </p>

        <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {formatNumber(
            transactions.length,
            language
          )}
        </p>
      </div>

      {/* Budgets */}
      <div
        className="
          rounded-xl
          bg-slate-50
          p-4
          transition-colors
          hover:bg-slate-100
          dark:bg-slate-800
          dark:hover:bg-slate-750
        "
      >
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {t("settings.budgetsStored")}
        </p>

        <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {formatNumber(
            budgets.length,
            language
          )}
        </p>
      </div>

      {/* Categories */}
      <div
        className="
          rounded-xl
          bg-slate-50
          p-4
          transition-colors
          hover:bg-slate-100
          dark:bg-slate-800
          dark:hover:bg-slate-750
        "
      >
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {t("settings.categoriesStored")}
        </p>

        <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {formatNumber(
            totalCategoryCount,
            language
          )}
        </p>
      </div>
    </div>
  </section>

  {/* Danger Zone */}
  <section
    className="
      rounded-2xl
      border border-rose-200
      bg-white
      p-5
      shadow-sm
      transition-colors
      dark:border-rose-950
      dark:bg-slate-900
      sm:p-6
    "
  >
    <div className="flex items-start gap-3">
      <div
        className="
          flex h-10 w-10 shrink-0
          items-center justify-center
          rounded-xl
          bg-rose-50
          text-rose-600
          dark:bg-rose-950/50
          dark:text-rose-400
        "
      >
        <AlertTriangle
          size={19}
          strokeWidth={1.9}
        />
      </div>

      <div>
        <h2 className="font-semibold text-rose-700 dark:text-rose-400">
          {t("settings.dangerZone")}
        </h2>

        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
          {t(
            "settings.dangerZoneDescription"
          )}
        </p>
      </div>
    </div>

    <div
      className="
        mt-5
        flex flex-col gap-4
        rounded-xl
        border border-rose-100
        bg-rose-50/50
        p-4
        dark:border-rose-950
        dark:bg-rose-950/20
        sm:flex-row
        sm:items-center
        sm:justify-between
      "
    >
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          {t("settings.resetData")}
        </h3>

        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
          {t(
            "settings.resetDataDescription"
          )}
        </p>
      </div>

      <button
        type="button"
        onClick={() =>
          setIsResetDialogOpen(true)
        }
        className="
          inline-flex
          shrink-0
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-rose-600
          px-4 py-3
          text-sm font-semibold
          text-white
          shadow-sm
          transition-all duration-200
          hover:-translate-y-0.5
          hover:bg-rose-700
          hover:shadow-md
          active:translate-y-0
          active:scale-[0.98]
        "
      >
        <RotateCcw size={17} />

        {t("settings.resetData")}
      </button>
    </div>
  </section>

  {/* Reset Confirmation */}
  <ConfirmDialog
    isOpen={isResetDialogOpen}
    title={t("settings.resetConfirmTitle")}
    message={t(
      "settings.resetConfirmMessage"
    )}
    onCancel={() =>
      setIsResetDialogOpen(false)
    }
    onConfirm={handleReset}
  />
</div>


);
}

export default Settings;
