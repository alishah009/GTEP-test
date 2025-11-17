"use client";

import { useState } from "react";
import Link from "next/link";
import { useLogin } from "@/hooks/mutation/useAuth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const loginMutation = useLogin();

  const handleLogin = () => {
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      {loginMutation.isError && (
        <p className="text-red-500 mb-2">
          {loginMutation.error instanceof Error
            ? loginMutation.error.message
            : "An error occurred"}
        </p>
      )}
      <input
        className="w-full p-2 mb-2 border rounded"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loginMutation.isPending}
      />
      <input
        className="w-full p-2 mb-4 border rounded"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loginMutation.isPending}
      />
      <button
        className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleLogin}
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? "Logging in..." : "Login"}
      </button>
      <p className="text-center mt-4 text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-blue-600 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
