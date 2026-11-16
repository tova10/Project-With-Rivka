import { createContext, useState } from "react";
import { getUser, saveUser, removeUser } from "../utils/storage";

export const UserContext = createContext(null);

function UserProvider({ children }) {
  // בהתחלה: בודקים אם יש משתמש שמור ב-localStorage
  const [user, setUser] = useState(getUser);

  // כניסה: שומרים גם ב-localStorage וגם בזיכרון
  function login(userData) {
    saveUser(userData);
    setUser(userData);
  }

  // יציאה: מוחקים משניהם
  function logout() {
    removeUser();
    setUser(null);
  }

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;