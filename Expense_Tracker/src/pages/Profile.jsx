
import { useEffect, useState } from "react";
import {
  UserRound,
  Mail,
  LockKeyhole,
  ShieldCheck,
  Save,
  Eye,
  EyeOff,
  Trash2,
  LoaderCircle,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { useLanguage } from "../context/LanguageContext";

const cardClass =
  "mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6";

const inputClass =
  "w-full min-w-0 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-400 focus:ring-4 focus:ring-slate-900/5 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:hover:border-slate-600 dark:focus:border-slate-500 dark:focus:ring-white/5";

const primaryButtonClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-slate-700 active:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300";

const secondaryButtonClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:border-slate-300 hover:bg-slate-50 active:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800";

const sectionIconClass =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";

function getErrorMessage(error) {
  const data = error.response?.data;

  if (typeof data?.detail === "string") {
    return data.detail;
  }

  if (data && typeof data === "object") {
    const firstError = Object.values(data).flat()[0];

    if (typeof firstError === "string") {
      return firstError;
    }
  }

  return "Something went wrong. Please try again.";
}

function Profile() {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const [profile, setProfile] = useState({
    username: "",
    email: "",
  });

  const [profileForm, setProfileForm] = useState({
    username: "",
    email: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const response = await api.get("/accounts/me/");

        if (!active) return;

        const user = {
          username: response.data.username ?? "",
          email: response.data.email ?? "",
        };

        setProfile(user);
        setProfileForm(user);
      } catch (err) {
        if (active) setError(getErrorMessage(err));
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  const clearFeedback = () => {
    setMessage("");
    setError("");
  };

  const handleProfileChange = (event) => {
    setProfileForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handlePasswordChange = (event) => {
    setPasswordForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    clearFeedback();

    const username = profileForm.username.trim();
    const email = profileForm.email.trim();

    if (!username || !email) {
      setError("Username and email are required.");
      return;
    }

    setSavingProfile(true);

    try {
      const response = await api.patch("/accounts/me/", {
        username,
        email,
      });

      const updatedProfile = {
        username: response.data.username,
        email: response.data.email,
      };

      setProfile(updatedProfile);
      setProfileForm(updatedProfile);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    clearFeedback();

    if (
      passwordForm.new_password !== passwordForm.confirm_password
    ) {
      setError("New password and confirmation do not match.");
      return;
    }

    if (passwordForm.new_password.length < 8) {
      setError("New password must contain at least 8 characters.");
      return;
    }

    setChangingPassword(true);

    try {
      await api.post("/accounts/password/change/", {
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
      });

      setPasswordForm({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });

      setMessage("Password changed successfully.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    clearFeedback();

    const confirmation = window.prompt(
      `This permanently deletes your account and may delete associated financial data.\n\nType "${profile.username}" to confirm:`
    );

    if (confirmation === null) return;

    if (confirmation !== profile.username) {
      setError("Username did not match. Account was not deleted.");
      return;
    }

    const finalConfirmation = window.confirm(
      "Are you absolutely sure? This action cannot be undone."
    );

    if (!finalConfirmation) return;

    setDeletingAccount(true);

    try {
      await api.delete("/accounts/delete/");

      localStorage.removeItem("spendly_access");
      localStorage.removeItem("spendly_refresh");

      navigate("/register", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
      setDeletingAccount(false);
    }
  };

  if (loading) {
    return (
      <div
        lang={language}
        className="flex min-h-64 items-center justify-center gap-2 text-slate-500 dark:text-slate-400"
      >
        <LoaderCircle size={22} className="shrink-0 animate-spin" />
        <span className="text-sm">Loading your profile...</span>
      </div>
    );
  }

  const passwordFields = [
    {
      name: "current_password",
      label: "Current Password",
      autoComplete: "current-password",
    },
    {
      name: "new_password",
      label: "New Password",
      autoComplete: "new-password",
    },
    {
      name: "confirm_password",
      label: "Confirm New Password",
      autoComplete: "new-password",
    },
  ];

  return (
    <div
      lang={language}
      className="mx-auto w-full min-w-0 max-w-4xl"
    >
      {/* Page header */}
      <header className="mb-6 sm:mb-8">
        <div className="flex min-w-0 items-start gap-3">
          <div className={`${sectionIconClass} h-11 w-11`}>
            <UserRound size={21} strokeWidth={1.9} />
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              My Profile
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Manage your personal information and account security.
            </p>
          </div>
        </div>
      </header>

      {/* Feedback */}
      {(message || error) && (
        <div
          role={error ? "alert" : "status"}
          aria-live="polite"
          className={`mb-6 flex items-start gap-2 rounded-xl px-4 py-3 text-sm font-medium ${
            error
              ? "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
              : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
          }`}
        >
          {error ? (
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
          ) : (
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          )}

          <p className="min-w-0 wrap-break-words">{error || message}</p>
        </div>
      )}

      {/* Personal information */}
      <section className={cardClass}>
        <div className="flex items-start gap-3">
          <div className={sectionIconClass}>
            <UserRound size={19} strokeWidth={1.9} />
          </div>

          <div className="min-w-0">
            <h2 className="font-semibold text-slate-900 dark:text-white">
              Personal Information
            </h2>

            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
              Update your username and email address.
            </p>
          </div>
        </div>

        <form onSubmit={handleProfileSubmit} className="mt-5 space-y-5">
          <div>
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Username
            </label>

            <div className="relative">
              <UserRound
                size={18}
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={profileForm.username}
                onChange={handleProfileChange}
                className={`${inputClass} pl-10`}
                required
                maxLength={150}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Email Address
            </label>

            <div className="relative">
              <Mail
                size={18}
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={profileForm.email}
                onChange={handleProfileChange}
                className={`${inputClass} pl-10`}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 dark:border-slate-800 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => {
                setProfileForm(profile);
                clearFeedback();
              }}
              className={secondaryButtonClass}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={savingProfile}
              className={primaryButtonClass}
            >
              {savingProfile ? (
                <LoaderCircle size={17} className="animate-spin" />
              ) : (
                <Save size={17} />
              )}

              {savingProfile ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </section>

      {/* Account security */}
      <section className={cardClass}>
        <div className="flex items-start gap-3">
          <div className={sectionIconClass}>
            <ShieldCheck size={19} strokeWidth={1.9} />
          </div>

          <div className="min-w-0">
            <h2 className="font-semibold text-slate-900 dark:text-white">
              Account Security
            </h2>

            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
              Change your password to keep your account secure.
            </p>
          </div>
        </div>

        <form onSubmit={handlePasswordSubmit} className="mt-5 space-y-5">

{passwordFields.map((field) => (
  <div key={field.name}>
    <label
      htmlFor={field.name}
      className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
    >
      {field.label}
    </label>

    <div className="relative">
      <LockKeyhole
        size={18}
        aria-hidden="true"
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        id={field.name}
        name={field.name}
        type={showPasswords ? "text" : "password"}
        autoComplete={field.autoComplete}
        value={passwordForm[field.name]}
        onChange={handlePasswordChange}
        className={`${inputClass} pl-10 pr-12`}
        required
        minLength={
          field.name === "current_password" ? undefined : 8
        }
      />

      <button
        type="button"
        onClick={() =>
          setShowPasswords((previous) => !previous)
        }
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
        aria-label={showPasswords ? "Hide passwords" : "Show passwords"}
        title={showPasswords ? "Hide passwords" : "Show passwords"}
      >
        {showPasswords ? (
          <EyeOff size={18} />
        ) : (
          <Eye size={18} />
        )}
      </button>
    </div>
  </div>
))}


          <div className="flex justify-end border-t border-slate-100 pt-5 dark:border-slate-800">
            <button
              type="submit"
              disabled={changingPassword}
              className={primaryButtonClass}
            >
              {changingPassword ? (
                <LoaderCircle size={17} className="animate-spin" />
              ) : (
                <LockKeyhole size={17} />
              )}

              {changingPassword ? "Updating..." : "Change Password"}
            </button>
          </div>
        </form>
      </section>

      {/* Danger zone */}
      <section className="mb-6 rounded-2xl border border-rose-200 bg-white p-5 shadow-sm dark:border-rose-950 dark:bg-slate-900 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
            <Trash2 size={19} strokeWidth={1.9} />
          </div>

          <div className="min-w-0">
            <h2 className="font-semibold text-rose-700 dark:text-rose-400">
              Danger Zone
            </h2>

            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
              Permanently delete your account. This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-4 rounded-xl border border-rose-100 bg-rose-50/50 p-4 dark:border-rose-950 dark:bg-rose-950/20 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Delete Account
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
              Your account and associated data may be permanently removed.
            </p>
          </div>

          <button
            type="button"
            onClick={handleDeleteAccount}
            disabled={deletingAccount}
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-rose-700 active:bg-rose-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deletingAccount ? (
              <LoaderCircle size={17} className="animate-spin" />
            ) : (
              <Trash2 size={17} />
            )}

            {deletingAccount ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </section>
    </div>
  );
}

export default Profile;
