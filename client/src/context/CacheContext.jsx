import { createContext, useCallback, useMemo, useState } from "react";

export const CacheContext = createContext(null);

function CacheProvider({ children }) {
  const [cache, setCache] = useState({});

  const saveList = useCallback((key, newList) => {
    setCache((prev) => ({ ...prev, [key]: newList }));
  }, []);

  const changeList = useCallback((resource, key, change) => {
    setCache((prev) => {
      const next = {};
      for (const otherKey in prev) {
        if (otherKey.split("?")[0] !== resource) next[otherKey] = prev[otherKey];
      }
      next[key] = change(prev[key]);
      return next;
    });
  }, []);

  const clearCache = useCallback(() => {
    setCache({});
  }, []);

  const value = useMemo(
    () => ({ cache, saveList, changeList, clearCache }),
    [cache, saveList, changeList, clearCache]
  );

  return <CacheContext.Provider value={value}>{children}</CacheContext.Provider>;
}

export default CacheProvider;