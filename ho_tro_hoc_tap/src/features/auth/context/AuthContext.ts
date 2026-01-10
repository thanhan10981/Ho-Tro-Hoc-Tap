import { createContext } from "react";
import type { UserMe } from "../types/auth.type";

export interface AuthContextType {
  user: UserMe | null;
  loginSuccess: (token: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
