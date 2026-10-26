import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Receipt,
  Settings,
  Tags,
  WalletCards,
  X,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

const menuItems = [
  {
    label: "dashboard",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    label: "transactions",
    icon: Receipt,
    path: "/transactions",
  },
  {
    label: "budgets",
    icon: WalletCards,
    path: "/budgets",
  },
  {
    label: "reports",
    icon: BarChart3,
    path: "/reports",
  },
  {
    label: "categories",
    icon: Tags,
    path: "/categories",
  },
];

function Sidebar({
  isCollapsed,
  isMobileOpen,
  onClose,
  onMenuToggle,
}) {
  const { t } = useLanguage();

  const navLinkClass = ({ isActive }) => `
    group
    relative
    flex
    w-full
    items-center
    gap-3
    rounded-xl
    px-3.5
    py-3
    text-sm
    font-medium
    transition-all
    duration-200
    ${
      isActive
        ? "bg-slate-900 text-white shadow-sm dark:bg-slate-100 dark:text-slate-900"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
    }
  `;

  return (
    <>
      {/* Mobile Overlay */}
      <button
        type="button"
        aria-label="Close navigation menu"
        onClick={onClose}
        className={`
          fixed
          inset-0
          z-40
          bg-slate-950/50
          backdrop-blur-sm
          transition-opacity
          duration-300
          md:hidden
          ${
            isMobileOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }
        `}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed
          left-0
          top-0
          z-50
          flex
          h-screen
          flex-col
          border-r
          border-slate-200/90
          bg-white
          transition-all
          duration-300
          ease-in-out
          dark:border-slate-800/90
          dark:bg-slate-950

          ${
            isCollapsed
              ? "md:w-20"
              : "md:w-64"
          }

          w-64

          ${
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }

          md:translate-x-0
        `}
      >
        {/* Header */}
        <div
          className={`
            flex
            h-20
            shrink-0
            items-center
            border-b
            border-slate-200/90
            transition-all
            duration-300
            dark:border-slate-800/90

            ${
              isCollapsed
                ? "justify-center px-2"
                : "justify-between px-4"
            }
          `}
        >
          {/* Logo */}
          <NavLink
            to="/"
            onClick={onClose}
            className={`
              group
              inline-flex
              min-w-0
              items-center
              text-xl
              font-bold
              tracking-tight
              text-slate-900
              dark:text-white

              ${
                isCollapsed
                  ? "hidden"
                  : "flex-1"
              }
            `}
          >
            <span
    className={` pl-2.5
      whitespace-nowrap
      transition-all
      duration-200
      ${
        isCollapsed
          ? "hidden"
          : "block"
      }
    `}
  >
    Spendly
  </span>
          </NavLink>

          {/* Desktop / Tablet Collapse Button */}
          <button
            type="button"
            onClick={onMenuToggle}
            aria-label={
              isCollapsed
                ? "Expand sidebar"
                : "Collapse sidebar"
            }
            title={
              isCollapsed
                ? "Expand sidebar"
                : "Collapse sidebar"
            }
            className="
              hidden
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              border
              border-slate-200
              bg-white
              text-slate-500
              shadow-sm
              transition-all
              duration-200
              hover:border-slate-300
              hover:bg-slate-50
              hover:text-slate-900
              active:scale-95
              md:flex
              dark:border-slate-700
              dark:bg-slate-900
              dark:text-slate-400
              dark:hover:border-slate-600
              dark:hover:bg-slate-800
              dark:hover:text-white
            "
          >
            {isCollapsed ? (
              <ChevronRight
                size={18}
                strokeWidth={2}
              />
            ) : (
              <ChevronLeft
                size={18}
                strokeWidth={2}
              />
            )}
          </button>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              text-slate-500
              hover:bg-slate-100
              hover:text-slate-900
              md:hidden
              dark:text-slate-400
              dark:hover:bg-slate-800
              dark:hover:text-white
            "
          >
            <X size={19} />
          </button>
        </div>

        {/* Navigation */}
        <nav
          className="
            flex-1
            overflow-y-auto
            px-3.5
            py-5
          "
          aria-label="Main navigation"
        >
          {/* Menu Label */}
          <p
            className={`
              mb-2
              px-3
              text-[10px]
              font-bold
              uppercase
              tracking-[0.14em]
              text-slate-400
              dark:text-slate-500
              ${
                isCollapsed
                  ? "hidden"
                  : "block"
              }
            `}
          >
            Menu
          </p>

          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  onClick={onClose}
                  title={
                    isCollapsed
                      ? t(`nav.${item.label}`)
                      : undefined
                  }
                  className={`
                    ${navLinkClass({
                      isActive: false,
                    })}

                    ${
                      isCollapsed
                        ? "justify-center px-2"
                        : ""
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      {/* Active Indicator */}
                      {isActive && (
                        <span
                          className="
                            absolute
                            left-0
                            h-5
                            w-0.5
                            rounded-r-full
                            bg-white
                            dark:bg-slate-900
                          "
                        />
                      )}

                      {/* Icon */}
                      <span
                        className={`
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          transition-all
                          duration-200

                          ${
                            isActive
                              ? "bg-white/10 dark:bg-slate-900/10"
                              : "bg-transparent group-hover:bg-white dark:group-hover:bg-slate-700"
                          }
                        `}
                      >
                        <Icon
                          size={18}
                          strokeWidth={
                            isActive ? 2.2 : 1.9
                          }
                          className="
                            transition-transform
                            duration-200
                            group-hover:scale-105
                          "
                        />
                      </span>

                      {/* Label */}
                      <span
                        className={`
                          truncate
                          whitespace-nowrap
                          transition-all
                          duration-200

                          ${
                            isCollapsed
                              ? "hidden"
                              : "block"
                          }
                        `}
                      >
                        {t(
                          `nav.${item.label}`
                        )}
                      </span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Settings */}
        <div
          className="
            shrink-0
            border-t
            border-slate-200/90
            p-3.5
            dark:border-slate-800/90
          "
        >
          <NavLink
            to="/settings"
            onClick={onClose}
            title={
              isCollapsed
                ? t("nav.settings")
                : undefined
            }
            className={`
              ${navLinkClass({
                isActive: false,
              })}

              ${
                isCollapsed
                  ? "justify-center px-2"
                  : ""
              }
            `}
          >
            {({ isActive }) => (
              <>
                {/* Active Indicator */}
                {isActive && (
                  <span
                    className="
                      absolute
                      left-0
                      h-5
                      w-0.5
                      rounded-r-full
                      bg-white
                      dark:bg-slate-900
                    "
                  />
                )}

                {/* Icon */}
                <span
                  className={`
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    transition-all
                    duration-200

                    ${
                      isActive
                        ? "bg-white/10 dark:bg-slate-900/10"
                        : "bg-transparent group-hover:bg-white dark:group-hover:bg-slate-700"
                    }
                  `}
                >
                  <Settings
                    size={18}
                    strokeWidth={
                      isActive ? 2.2 : 1.9
                    }
                    className="
                      transition-transform
                      duration-200
                      group-hover:rotate-12
                    "
                  />
                </span>

                {/* Label */}
                <span
                  className={`
                    truncate
                    whitespace-nowrap

                    ${
                      isCollapsed
                        ? "hidden"
                        : "block"
                    }
                  `}
                >
                  {t("nav.settings")}
                </span>
              </>
            )}
          </NavLink>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;