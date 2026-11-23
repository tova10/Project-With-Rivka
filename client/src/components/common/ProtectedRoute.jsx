import { useContext } from "react";
import { Navigate, useParams } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

function ProtectedRoute({ children }) {
  const { user } = useContext(UserContext);
  const { username } = useParams();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.username !== username) {
    return <Navigate to={`/${user.username}`} replace />;
  }

  return children;
}

export default ProtectedRoute;
