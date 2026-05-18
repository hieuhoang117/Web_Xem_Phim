import { Navigate } from "react-router-dom";
import userStore from "../store/useUserStore";

const PrivateRoute = ({ children }) => {
  const userId = userStore((state) => state.userId);
  const role = userStore((state) => state.role);
  if (role === "Admin") {
    return <Navigate to="/admin" />;
  }

  if (!userId) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;