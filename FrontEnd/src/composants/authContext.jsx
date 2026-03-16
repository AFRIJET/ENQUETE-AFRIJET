import axios from "axios";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token") // Vérifie si un token est déjà stocké
  );
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [isHidden, setIsHidden] = useState(true)

  const apiUrl = import.meta.env.VITE_API_URL;

  const login = (token) => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    axios.post(`${apiUrl}/admin/logout`, {}, { withCredentials: true })
      .then((response) => {
        setIsAuthenticated(false);
        setStartDate(null);
        setEndDate(null)
      })
      .catch(error => {
        console.error('Erreur:', error);
      });
  };

  const changeDate = (StartDate, EndDate) => {
    setStartDate(StartDate || null);
    setEndDate(EndDate || null)
  }

  const renewSession = () => {
    const refreshInterval = 30 * 60 * 1000; // 30 minutes en millisecondes
    setInterval(() => {
      axios.post(`${apiUrl}/admin/renew`, {}, { withCredentials: true })
        .then((response) => {})
        .catch((error) => {
          logout();
        });
    }, refreshInterval);
  }


  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        changeDate,
        startDate,
        endDate,
        isHidden,
        setIsHidden,
        renewSession,
      }}

    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);