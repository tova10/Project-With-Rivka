import { useContext, useEffect, useState } from "react";
import { getData, addData, updateData, deleteData } from "../api/api";
import { CacheContext } from "../context/CacheContext";

const NO_ITEMS = [];

// כתובת הבקשה. עם pageSize - מביאים רק חלק: _start = מאיפה, _limit = כמה
// (בעימוד תמיד יש query, למשל "?albumId=5", ולכן מוסיפים עם &)
function buildPath(resource, query, pageSize, start) {
  if (!pageSize) return resource + query;
  return `${resource}${query}&_start=${start}&_limit=${pageSize}`;
}

// Hook לעבודה עם רשימה מהשרת: הבאה (דרך ה-Cache), הוספה, עדכון ומחיקה
// resource = "todos" / "posts" / "albums" ...
// query    = סינון בשרת, למשל "?userId=1"
// pageSize = כמה פריטים להביא בכל פעם (0 = הכול בבת אחת)
function useResource(resource, query = "", pageSize = 0) {
  const { cache, setCache } = useContext(CacheContext);
  const [error, setError] = useState("");

  const key = resource + query; // המפתח של הרשימה ב-Cache
  const list = cache[key]; // { items, offset, hasMore }, או undefined אם עוד לא הובאה
  const isLoaded = list !== undefined;

  // שומרים רשימה ב-Cache
  function saveList(newList) {
    setCache((prev) => ({ ...prev, [key]: newList }));
  }

  // הבאה מהשרת - רק אם הרשימה עוד לא נמצאת ב-Cache
  useEffect(() => {
    if (isLoaded) return;

    getData(buildPath(resource, query, pageSize, 0))
      .then((items) =>
        setCache((prev) => ({
          ...prev,
          [key]: { items, offset: items.length, hasMore: pageSize > 0 && items.length === pageSize },
        }))
      )
      .catch((err) => setError(err.message));
  }, [key, isLoaded, resource, query, pageSize, setCache]);

  // שינוי ברשימה (הוספה / עדכון / מחיקה).
  // רשימות אחרות של אותו resource נמחקות מה-Cache, כי הן כבר לא מעודכנות
  // (למשל "הפוסטים שלי" ו"כל הפוסטים"). בפעם הבאה שיצטרכו אותן - הן יובאו מחדש
  function changeList(change) {
    setCache((prev) => {
      const next = {};
      for (const otherKey in prev) {
        if (otherKey.split("?")[0] !== resource) next[otherKey] = prev[otherKey];
      }
      next[key] = change(prev[key]);
      return next;
    });
  }

  // הבאת החלק הבא (לתמונות)
  async function loadMore() {
    try {
      const more = await getData(buildPath(resource, query, pageSize, list.offset));
      // פריט שהוספנו בעצמנו כבר מופיע ברשימה - לא מוסיפים אותו שוב
      const newItems = more.filter((item) => !list.items.some((old) => old.id === item.id));
      saveList({
        items: [...list.items, ...newItems],
        offset: list.offset + more.length,
        hasMore: more.length === pageSize,
      });
    } catch (err) {
      setError(err.message);
    }
  }

  async function addItem(newItem) {
    try {
      const saved = await addData(resource, newItem);
      changeList((old) => ({ ...old, items: [...old.items, saved] }));
    } catch (err) {
      setError(err.message);
    }
  }

  async function updateItem(id, changes) {
    try {
      const updated = await updateData(resource, id, changes);
      changeList((old) => ({
        ...old,
        items: old.items.map((item) => (item.id === id ? updated : item)),
      }));
    } catch (err) {
      setError(err.message);
    }
  }

  async function removeItem(id) {
    try {
      await deleteData(resource, id);
      changeList((old) => ({
        ...old,
        items: old.items.filter((item) => item.id !== id),
        offset: old.offset - 1,
      }));
    } catch (err) {
      setError(err.message);
    }
  }

  return {
    items: isLoaded ? list.items : NO_ITEMS,
    loading: !isLoaded && !error,
    error,
    hasMore: isLoaded && list.hasMore,
    addItem,
    updateItem,
    removeItem,
    loadMore,
  };
}

export default useResource;
