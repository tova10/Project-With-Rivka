import { createContext, useMemo, useState } from "react";

export const CacheContext = createContext(null);

// Cache: כל המידע שכבר הגיע מהשרת, שמור לפי כתובת הבקשה.
// למשל: { "todos?userId=1": { items: [...], offset: 20, hasMore: false } }
// כך, כשחוזרים לעמוד, המידע נלקח מכאן ולא נשלחת בקשה חדשה לשרת.
function CacheProvider({ children }) {
  const [cache, setCache] = useState({});

  // useMemo: אותו אובייקט value כל עוד ה-cache לא השתנה
  const value = useMemo(() => ({ cache, setCache }), [cache]);

  return <CacheContext.Provider value={value}>{children}</CacheContext.Provider>;
}

export default CacheProvider;
