import {
  createContext,
  useState,
  useCallback,
  useMemo,
  useContext,
  // useEffect,
} from "react";
import api from "../services/api";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("@loan-system");

    if (token) {
      api.defaults.headers.common.authorization = token;
      return true;
    }

    return false;
  });

  const signOut = useCallback(() => {
    setUser(false);
    localStorage.removeItem("@loan-system");
  });

  const value = useMemo(
    () => ({
      signOut,
      user,
      setUser,
    }),
    [signOut, user, setUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
