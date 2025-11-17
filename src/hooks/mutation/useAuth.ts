"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/supabaseBrowser";
import { useRouter } from "next/navigation";
import type { User } from "@/entity/User";

// Login mutation
export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch session
      queryClient.invalidateQueries({ queryKey: ["session"] });
      router.push("/");
    },
  });
}

// Signup mutation
export function useSignup() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({
      email,
      password,
      fullName,
    }: {
      email: string;
      password: string;
      fullName: string;
    }) => {
      // Create user in Supabase Auth
      const { data: authData, error: authError } =
        await supabase.auth.signUp({
          email,
          password,
        });
        
      if (authError) throw authError;

      // Insert user profile into 'users' table
      if (authData.user?.id) {
        const userData: Pick<User, "id" | "full_name" | "role"> = {
          id: authData.user.id,
          full_name: fullName,
          role: "customer",
        };
        
        const { error: profileError } = await supabase
          .from("users")
          // @ts-expect-error - Supabase type inference issue with users table
          .insert(userData);

        if (profileError) throw profileError;
        throw 'error'
      }

      return authData;
    },
    onSuccess: () => {
      // Invalidate and refetch session
      queryClient.invalidateQueries({ queryKey: ["session"] });
      router.push("/login");
    },
  });
}

// Logout mutation
export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      // Clear session from cache
      queryClient.setQueryData(["session"], null);
      router.push("/login");
    },
  });
}

// Get current session
export function useSession() {
  return useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      return session;
    },
  });
}

// Get current user
export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user;
    },
  });
}

