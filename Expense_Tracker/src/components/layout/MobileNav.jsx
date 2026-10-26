import {
  BarChart3,
  LayoutDashboard,
  Plus,
  Receipt,
  Settings,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

function MobileNav({ onAddTransaction }) {
  const { t } = useLanguage();

  const navLinkClass = ({ isActive }) => `
    group
    relative
    flex min-w-0
    flex-1
    flex-col
    items-center
    justify-center
    gap-1
    rounded-xl
    px-1
    py-1.5
    text-[10px]
    font-medium
    transition-all duration-200
    xs:text-[11px]
    ${
      isActive
        ? "text-slate-900 dark:text-white"
        : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
    }
  `;

  return (
    <nav
      className="
        fixed inset-x-0 bottom-0 z-40
        border-t border-slate-200/90
        bg-white/95
        px-1.5
        pt-2
        shadow-[0_-8px_30px_rgba(15,23,42,0.06)]
        backdrop-blur-xl
        dark:border-slate-800/90
        dark:bg-slate-950/95
        dark:shadow-[0_-8px_30px_rgba(0,0,0,0.18)]
        md:hidden
      "
      style={{
        paddingBottom:
          "max(0.5rem, env(safe-area-inset-bottom))",
      }}
    >
      <div
        className="
          mx-auto
          flex
          max-w-lg
          items-end
          justify-between
          gap-0.5
          sm:gap-1
        "
      >
        {/* Dashboard */}
        <NavLink
          to="/"
          className={navLinkClass}
          end
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span
                  className="
                    absolute -top-2
                    h-0.5 w-6
                    rounded-full
                    bg-slate-900
                    dark:bg-white
                  "
                />
              )}

              <LayoutDashboard
                size={20}
                strokeWidth={isActive ? 2.2 : 1.9}
                className="
                  transition-transform duration-200
                  group-hover:scale-105
                "
              />

              <span className="truncate">
                {t("nav.dashboard")}
              </span>
            </>
          )}
        </NavLink>

        {/* Transactions */}
        <NavLink
          to="/transactions"
          className={navLinkClass}
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span
                  className="
                    absolute -top-2
                    h-0.5 w-6
                    rounded-full
                    bg-slate-900
                    dark:bg-white
                  "
                />
              )}

              <Receipt
                size={20}
                strokeWidth={isActive ? 2.2 : 1.9}
                className="
                  transition-transform duration-200
                  group-hover:scale-105
                "
              />

              <span className="truncate">
                {t("nav.transactions")}
              </span>
            </>
          )}
        </NavLink>

        {/* Add transaction */}
        <div
          className="
            flex
            flex-1
            justify-center
          "
        >
          <button
            type="button"
            onClick={onAddTransaction}
            aria-label={t("dashboard.addTransaction")}
            className="
              -mt-8
              flex
              h-14 w-14
              shrink-0
              items-center
              justify-center
              rounded-full
              border-4
              border-white
              bg-slate-900
              text-white
              shadow-[0_8px_25px_rgba(15,23,42,0.22)]
              transition-all duration-200
              hover:-translate-y-0.5
              hover:bg-slate-800
              hover:shadow-[0_10px_30px_rgba(15,23,42,0.28)]
              active:translate-y-0
              active:scale-90
              dark:border-slate-950
              dark:bg-slate-100
              dark:text-slate-900
              dark:hover:bg-white
            "
          >
            <Plus
              size={25}
              strokeWidth={2.2}
            />
          </button>
        </div>

        {/* Reports */}
        <NavLink
          to="/reports"
          className={navLinkClass}
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span
                  className="
                    absolute -top-2
                    h-0.5 w-6
                    rounded-full
                    bg-slate-900
                    dark:bg-white
                  "
                />
              )}

              <BarChart3
                size={20}
                strokeWidth={isActive ? 2.2 : 1.9}
                className="
                  transition-transform duration-200
                  group-hover:scale-105
                "
              />

              <span className="truncate">
                {t("nav.reports")}
              </span>
            </>
          )}
        </NavLink>

        {/* Settings */}
        <NavLink
          to="/settings"
          className={navLinkClass}
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span
                  className="
                    absolute -top-2
                    h-0.5 w-6
                    rounded-full
                    bg-slate-900
                    dark:bg-white
                  "
                />
              )}

              <Settings
                size={20}
                strokeWidth={isActive ? 2.2 : 1.9}
                className="
                  transition-transform duration-200
                  group-hover:scale-105
                "
              />

              <span className="truncate">
                {t("nav.settings")}
              </span>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  );
}

export default MobileNav;