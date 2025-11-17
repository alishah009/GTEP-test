"use client";

import { useState } from "react";
import Link from "next/link";
import { useSignup } from "@/hooks/mutation/useAuth";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const signupMutation = useSignup();

  const handleSignUp = () => {
    signupMutation.mutate({
      email, password, full_name: fullName,
      id: "",
    });
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      {signupMutation.isError && (
        <p className="text-red-500 mb-2">
          {signupMutation.error instanceof Error
            ? signupMutation.error.message
            : "An error occurred"}
        </p>
      )}
      <input
        className="w-full p-2 mb-2 border rounded"
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        disabled={signupMutation.isPending}
      />
      <input
        className="w-full p-2 mb-2 border rounded"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={signupMutation.isPending}
      />
      <input
        className="w-full p-2 mb-4 border rounded"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={signupMutation.isPending}
      />
      <button
        className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleSignUp}
        disabled={signupMutation.isPending}
      >
        {signupMutation.isPending ? "Signing up..." : "Sign Up"}
      </button>
      <p className="text-center mt-4 text-sm">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
