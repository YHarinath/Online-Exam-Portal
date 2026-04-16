"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const inputClass =
  "w-full px-4 py-2.5 rounded-lg text-white placeholder-slate-400 bg-white/10 border border-white/20 focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none transition-all";

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (data.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/student");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-red-300 bg-red-500/20 border border-red-500/40 p-3 rounded-lg text-sm font-semibold">
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-semibold text-slate-200 mb-1.5">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className={inputClass}
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-200 mb-1.5">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          className={inputClass}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white rounded-lg flex justify-center items-center font-semibold shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-50 mt-2"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
      </button>
    </form>
  );
}
