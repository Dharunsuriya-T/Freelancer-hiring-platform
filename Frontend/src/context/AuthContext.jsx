import { createContext, useContext, useEffect, useState } from "react";
import { fetchMe, loginUser, signupUser, logoutUser } from "../api/auth";

const AuthContext = createContext();
const TOKEN_KEY = "freelance_token";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await fetchMe();
        setUser(data.user);
      } catch (error) {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, [token]);

  const handleAuthSuccess = (payload) => {
    setToken(payload.token);
    localStorage.setItem(TOKEN_KEY, payload.token);
    setUser(payload.user);
  };

  const login = async (credentials) => {
    const { data } = await loginUser(credentials);
    handleAuthSuccess(data);
    return data;
  };

  const signup = async (payload) => {
    const { data } = await signupUser(payload);
    handleAuthSuccess(data);
    return data;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used within AuthProvider");
  return context;
};

