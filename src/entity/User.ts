import { Role } from "@/types/User";

export type User = {
    id: string;
    email?: string;
    full_name?: string;
    role: Role;
    created_at: string;
  };