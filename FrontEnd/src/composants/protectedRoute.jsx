import { Navigate } from "react-router-dom";
import { useAuth } from "./authContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? children : <Navigate to="/admin" replace />;
};

export default ProtectedRoute;