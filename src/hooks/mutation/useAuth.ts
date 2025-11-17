"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/supabaseBrowser";
import { useRouter } from "next/navigation";
import  { User } from "@/entity/User";
import { Role } from "@/enum/User";

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
    mutationFn: async (user: User) => {
      // Create user in Supabase Auth
      const { data: authData, error: authError } =
        await supabase.auth.signUp({
          email: user.email!,
          password: user.password!,
        });
        
      if (authError) throw authError;

      // Insert user profile into 'users' table
      if (authData.user?.id) {
       
        
        const { error: profileError } = await supabase
          .from("users")
          // @ts-expect-error - Supabase type inference issue with users table
          .insert({...user,role: Role.CUSTOMER});

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

