import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token") // Vérifie si un token est déjà stocké
  );

  const login = (token) => {
    localStorage.setItem("token", token); // Stocke le token
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token"); // Supprime le token
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);