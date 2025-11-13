"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/supabaseBrowser";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email) return alert("Please enter your email");

    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      alert(error.message);
    } else {
      alert(
        "Magic link sent! Check your email to log in to GTEP LMS."
      );
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen px-4">
      <h1 className="text-3xl font-bold mb-6">Login to GTEP</h1>

      <input
        type="email"
        placeholder="Enter your email"
        className="border border-gray-300 p-2 rounded w-full max-w-sm mb-4"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={handleLogin}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full max-w-sm"
      >
        {loading ? "Sending..." : "Send Magic Link"}
      </button>
    </div>
  );
}
