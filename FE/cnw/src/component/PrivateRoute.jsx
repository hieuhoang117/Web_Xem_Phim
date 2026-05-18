import { Navigate } from "react-router-dom";
import userStore from "../store/useUserStore";

const PrivateRoute = ({ children, requiredRole }) => {
  const userId = userStore((state) => state.userId);
  // const role = userStore((state) => state.role);
  const token = userStore((state) => state.token);


  if (!token || !userId) {
    return <Navigate to="/" />;
  }

  // if (requiredRole && role !== requiredRole) {
  //   if (role === "Admin") return <Navigate to="/admin" />;
  //   if (role === "User") return <Navigate to="/user/menu_main" />;
  // }

  return children;
};

export default PrivateRoute;