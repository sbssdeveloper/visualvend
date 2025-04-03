import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AuthProvider = ({ children }) => {
  const { user } = useSelector((value) => value?.auth);
  if (user?.token) {
    return children;
  }
  return <Navigate to="/" replace />;
};

export default AuthProvider;
