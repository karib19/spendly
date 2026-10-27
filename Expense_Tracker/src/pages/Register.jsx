import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Wallet,
  Eye,
  EyeOff,
  UserRound,
  Mail,
  LockKeyhole,
  ArrowRight,
  LoaderCircle,
  CheckCircle2,
} from "lucide-react";
import api from "../api/client";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (form.password !== form.password2) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/accounts/register/", form);
      navigate("/login", {
        replace: true,
        state: { message: "Account created successfully. Please sign in." },
      });
    } catch (err) {
      const data = err.response?.data;

      if (data && typeof data === "object") {
        const messages = Object.entries(data)
          .map(([field, value]) => {
            const label =
              field === "non_field_errors"
                ? ""
                : `${field.replaceAll("_", " ")}: `;

            const text = Array.isArray(value)
              ? value.join(", ")
              : typeof value === "string"
                ? value
                : JSON.stringify(value);

            return `${label}${text}`;
          })
          .join(" ");

        setError(messages || "Registration failed. Please try again.");
      } else {
        setError(
          err.message || "Registration failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60";

  const labelClass =
    "mb-2 block text-sm font-semibold text-slate-700";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-10">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Brand */}
        <Link
          to="/register"
          className="mb-7 flex items-center justify-center gap-3"
          aria-label="Spendly registration"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <Wallet size={26} strokeWidth={2.2} />
          </span>

          <span className="text-3xl font-extrabold tracking-tight text-slate-900">
            Spendly
          </span>
        </Link>

        {/* Registration card */}
        <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-9">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <UserRound size={28} />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Create your account
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Start managing your money with Spendly.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label htmlFor="username" className={labelClass}>
                Username
              </label>

              <div className="relative">
                <UserRound
                  size={19}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  placeholder="Choose a username"
                  required
                  maxLength={150}
                  value={form.username}
                  onChange={handleChange}
                  disabled={loading}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className={labelClass}>
                Email address
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                  value={form.email}
                  onChange={handleChange}
                  disabled={loading}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className={labelClass}>
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={19}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Create a strong password"
                  required
                  minLength={8}
                  value={form.password}
                  onChange={handleChange}
                  disabled={loading}
                  className={`${inputClass} pr-12`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>

              <p className="mt-1.5 text-xs text-slate-400">
                Use at least 8 characters.
              </p>
            </div>

            {/* Confirm password */}
            <div>
              <label htmlFor="password2" className={labelClass}>
                Confirm password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={19}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="password2"
                  name="password2"
                  type={showPassword2 ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Enter your password again"
                  required
                  value={form.password2}
                  onChange={handleChange}
                  disabled={loading}
                  className={`${inputClass} pr-12`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword2((previous) => !previous)}
                  aria-label={
                    showPassword2 ? "Hide password" : "Show password"
                  }
                  aria-pressed={showPassword2}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {showPassword2 ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>

              {form.password2 && form.password === form.password2 && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-emerald-600">
                  <CheckCircle2 size={14} />
                  Passwords match
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 hover:shadow-blue-600/30 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <LoaderCircle size={19} className="animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </>
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-medium text-slate-400">
              ALREADY HAVE AN ACCOUNT?
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <p className="text-center text-sm text-slate-600">
            Already registered?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-600 transition hover:text-blue-700 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </section>

        <p className="mt-6 text-center text-xs text-slate-400">
          Your financial journey starts here.
        </p>
      </div>
    </main>
  );
}