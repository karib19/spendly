import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Wallet,
  Eye,
  EyeOff,
  LockKeyhole,
  UserRound,
  ArrowRight,
  LoaderCircle,
} from "lucide-react";
import api from "../api/client";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    setLoading(true);

    try {
      const response = await api.post("/accounts/login/", form);
      const { access, refresh } = response.data;

      if (!access || !refresh) {
        throw new Error("Invalid login response. Please try again.");
      }

      localStorage.setItem("spendly_access", access);
      localStorage.setItem("spendly_refresh", refresh);

      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.error ||
          err.message ||
          "Login failed. Check your credentials."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-10">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Brand */}
        <Link
          to="/login"
          className="mb-8 flex items-center justify-center gap-3"
          aria-label="Spendly login"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <Wallet size={26} strokeWidth={2.2} />
          </span>

          <span className="text-3xl font-extrabold tracking-tight text-slate-900">
            Spendly
          </span>
        </Link>

        {/* Login card */}
        <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-9">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Welcome back
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Sign in to manage your money with confidence.
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

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
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
                  placeholder="Enter your username"
                  required
                  value={form.username}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>
              </div>

              <div className="relative">
                <LockKeyhole
                  size={19}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
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
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 hover:shadow-blue-600/30 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <LoaderCircle size={19} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </>
              )}
            </button>
          </form>

          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-medium text-slate-400">
              NEW TO SPENDLY?
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <p className="text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-blue-600 transition hover:text-blue-700 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </section>

        <p className="mt-6 text-center text-xs text-slate-400">
          Take control of your finances, one step at a time.
        </p>
      </div>
    </main>
  );
}