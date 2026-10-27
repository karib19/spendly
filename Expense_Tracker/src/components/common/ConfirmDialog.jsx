import { useEffect } from "react";
import { AlertTriangle, X, LoaderCircle } from "lucide-react";

function ConfirmDialog({
  isOpen,
  title,
  message,
  onCancel,
  onConfirm,
  isLoading = false,
  error = "",
}) {
  useEffect(() => {
    if (!isOpen || isLoading) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isLoading, onCancel]);

  if (!isOpen) return null;

  const handleCancel = () => {
    if (isLoading) return;
    onCancel();
  };

  const handleConfirm = () => {
    if (isLoading) return;
    onConfirm();
  };

  return (
    <div
      className="
        fixed inset-0 z-60 flex items-center justify-center
        bg-slate-950/60 p-4 backdrop-blur-md
        animate-[fadeIn_160ms_ease-out]
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-message"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close confirmation dialog"
        onClick={handleCancel}
        disabled={isLoading}
        className="absolute inset-0 cursor-default disabled:cursor-not-allowed"
      />

      {/* Dialog */}
      <div
        className="
          relative w-full max-w-md overflow-hidden
          rounded-3xl border border-slate-200/80
          bg-white shadow-[0_25px_80px_rgba(15,23,42,0.25)]
          animate-[dialogIn_200ms_ease-out]
          dark:border-slate-700/80 dark:bg-slate-900
          dark:shadow-[0_25px_80px_rgba(0,0,0,0.5)]
        "
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleCancel}
          disabled={isLoading}
          className="
            absolute right-4 top-4
            flex h-9 w-9 items-center justify-center
            rounded-xl text-slate-400
            transition-all duration-200 hover:rotate-90
            hover:bg-slate-100 hover:text-slate-700
            active:scale-90 disabled:cursor-not-allowed
            disabled:opacity-50 disabled:hover:rotate-0
            dark:text-slate-500 dark:hover:bg-slate-800
            dark:hover:text-white
          "
          aria-label="Close confirmation dialog"
          title="Close"
        >
          <X size={18} />
        </button>

        {/* Content */}
        <div className="p-6 sm:p-7">
          {/* Warning Icon */}
          <div
            className="
              flex h-12 w-12 items-center justify-center
              rounded-2xl bg-rose-50 text-rose-600
              ring-8 ring-rose-50/60
              dark:bg-rose-950/50 dark:text-rose-400
              dark:ring-rose-950/20
            "
          >
            <AlertTriangle size={22} strokeWidth={2.2} />
          </div>

          {/* Text */}
          <div className="mt-5 pr-6">
            <h2
              id="confirm-dialog-title"
              className="text-lg font-bold tracking-tight text-slate-900 dark:text-white"
            >
              {title}
            </h2>

            <p
              id="confirm-dialog-message"
              className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-500 dark:text-slate-400"
            >
              {message}
            </p>

            {error && (
              <p
                role="alert"
                className="
                  mt-3 rounded-xl border border-rose-200
                  bg-rose-50 px-3 py-2 text-sm leading-5
                  text-rose-700 dark:border-rose-900/60
                  dark:bg-rose-950/40 dark:text-rose-300
                "
              >
                {error}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="
                flex-1 rounded-xl border border-slate-200
                bg-white px-4 py-3 text-sm font-semibold
                text-slate-700 transition-all duration-200
                hover:border-slate-300 hover:bg-slate-50
                active:scale-[0.98] disabled:cursor-not-allowed
                disabled:opacity-50 dark:border-slate-700
                dark:bg-slate-900 dark:text-slate-200
                dark:hover:bg-slate-800
              "
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={isLoading}
              className="
                inline-flex flex-1 items-center justify-center
                gap-2 rounded-xl bg-rose-600 px-4 py-3
                text-sm font-semibold text-white shadow-sm
                transition-all duration-200
                hover:-translate-y-0.5 hover:bg-rose-700
                hover:shadow-md active:translate-y-0
                active:scale-[0.98] disabled:cursor-not-allowed
                disabled:opacity-60 disabled:hover:translate-y-0
                disabled:hover:shadow-sm
              "
            >
              {isLoading && (
                <LoaderCircle size={16} className="animate-spin" />
              )}

              {isLoading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes dialogIn {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}

export default ConfirmDialog;