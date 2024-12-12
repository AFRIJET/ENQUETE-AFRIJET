import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token") // Vérifie si un token est déjà stocké
  );
  const [startDate, setStartDate] = useState(null) 
  const [endDate, setEndDate] = useState(null) 


  const login = (token) => {
    localStorage.setItem("token", token); // Stocke le token
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token"); // Supprime le token
    setIsAuthenticated(false);
    setStartDate(null);
    setEndDate(null)
  };

  const changeDate = (StartDate, EndDate) => {
    setStartDate(StartDate || null);
    setEndDate(EndDate || null)
  }

  

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, changeDate, startDate, endDate }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);