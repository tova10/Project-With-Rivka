import { useContext } from "react";
import { Navigate, useParams } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

// children = מה שמוגן (הדף שבתוך השומר)
function ProtectedRoute({ children }) {
  const { user } = useContext(UserContext);
  const { username } = useParams();

  // אין משתמש מחובר: לדף הכניסה
  // replace = מחליפים את הכתובת בהיסטוריה, כדי שכפתור "אחורה" לא יחזיר לכאן שוב
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // הכתובת שייכת למשתמש אחר: לדף הבית של המחובר
  if (user.username !== username) {
    return <Navigate to={`/${user.username}`} replace />;
  }

  // הכול תקין: מציגים את הדף
  return children;
}

export default ProtectedRoute;
