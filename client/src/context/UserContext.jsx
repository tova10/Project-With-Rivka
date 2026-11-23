import { createContext, useContext, useState } from "react";
import { CacheContext } from "./CacheContext";

export const UserContext = createContext(null);

const USER_KEY = "currentUser";

function UserProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem(USER_KEY)));
  const { clearCache } = useContext(CacheContext);

  function login(userData) {
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData);
  }

  function logout() {
    localStorage.removeItem(USER_KEY);
    clearCache();
    setUser(null);
  }

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
