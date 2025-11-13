"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/supabaseBrowser";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
    setError(null);
    // Create user in Supabase Auth
    // const { data, error } = await supabase.auth.signUp({
    //   email,
    //   password,
    // });

    // if (error) {
    //   setError(error.message);
    //   return;
    // }

    // // Insert user profile into 'users' table
    // await supabase.from("users").insert({
    //   id: data.user?.id,
    //   email,
    //   full_name: fullName,
    //   role: "customer",
    // });

    router.push("/login"); // Redirect to login page
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <input
        className="w-full p-2 mb-2 border rounded"
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />
      <input
        className="w-full p-2 mb-2 border rounded"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="w-full p-2 mb-4 border rounded"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="w-full bg-blue-600 text-white p-2 rounded"
        onClick={handleSignUp}
      >
        Sign Up
      </button>
    </div>
  );
}
