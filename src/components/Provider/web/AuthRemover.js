import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AuthRemover = ({ children }) => {
  const { user } = useSelector((value) => value?.auth);

  if (user?.token) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default AuthRemover;
