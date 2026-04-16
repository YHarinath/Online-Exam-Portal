import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-indigo-600 via-blue-700 to-cyan-500">
      <div
        className="w-full max-w-md rounded-2xl p-8 space-y-6"
        style={{
          background: "rgba(10, 15, 40, 0.88)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(99, 102, 241, 0.35)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
        }}
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-indigo-300">
            Welcome Back
          </h1>
          <p className="text-sm mt-2 text-slate-300">Log in to your exam portal</p>
        </div>
        <LoginForm />
        <div className="text-center text-sm text-slate-300">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-cyan-300 hover:text-cyan-200 transition-colors underline underline-offset-2"
          >
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
