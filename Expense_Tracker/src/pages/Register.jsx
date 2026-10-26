import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (form.password !== form.password2) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/accounts/register/", form);
      navigate("/login");
    } catch (err) {
      const data = err.response?.data;

      setError(
        typeof data === "object"
          ? Object.entries(data)
              .map(([field, messages]) =>
                `${field}: ${
                  Array.isArray(messages)
                    ? messages.join(", ")
                    : messages
                }`
              )
              .join(" ")
          : "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-2xl bg-white p-8 shadow-lg"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            Create Account
          </h1>
          <p className="mt-2 text-slate-500">
            Start managing your money with Spendly
          </p>
        </div>

        {error && (
          <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <div>
          <label htmlFor="username" className="mb-1 block text-sm font-medium text-black">
            Username
          </label>
          <input
            id="username"
            name="username"
            autoComplete="username"
            required
            value={form.username}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-black">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium  text-black">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="password2" className="mb-1 block text-sm font-medium text-black">
            Confirm Password
          </label>
          <input
            id="password2"
            name="password2"
            type="password"
            autoComplete="new-password"
            required
            value={form.password2}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="text-center text-sm text-slate-600">
          Already registered?{" "}
          <Link to="/login" className="font-semibold text-blue-600">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
