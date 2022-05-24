import {
  createContext,
  useState,
  useCallback,
  useMemo,
  useContext,
  useEffect,
} from "react";
import api from "../services/api";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signOut = useCallback(() => {
    setUser(null);
    localStorage.removeItem("@loan-system");
  });

  useEffect(() => {
    const { token } = JSON.parse(localStorage.getItem("@loan-system")) || {};

    async function getUser() {
      try {
        api.defaults.headers.common.authorization = token;
        const response = await api.get("login/check", token);
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        setUser(null);
        setLoading(false);
      }
    }

    if (token) {
      getUser();
    } else {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      signOut,
      user,
      setUser,
      loading,
    }),
    [signOut, user, setUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
