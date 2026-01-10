import { useEffect, useState } from "react";
import type { UserMe } from "../types/auth.type";
import { getMeApi } from "../api/auth.api";
import { getToken, setToken, clearToken } from "../util/token";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserMe | null>(null);

  useEffect(() => {
    if (getToken()) {
      getMeApi()
        .then(setUser)
        .catch(() => {
          clearToken();
          setUser(null);
        });
    }
  }, []);

  const loginSuccess = async (token: string) => {
    setToken(token);
    const me = await getMeApi();
    setUser(me);
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginSuccess, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
