import { useEffect, useState } from "react";
import { getData, addData, updateData, deleteData } from "../api/api";

// בונה את הכתובת לשרת. אם יש pageSize, מוסיפים מספר עמוד וכמות
function buildPath(resource, query, pageSize, page) {
  let path = `${resource}${query}`;

  if (pageSize > 0) {
    const separator = query ? "&" : "?";
    path += `${separator}_page=${page}&_limit=${pageSize}`;
  }

  return path;
}

// Hook גנרי לכל רשימה: מביא, מוסיף, מעדכן ומוחק
// resource = שם המגירה ("todos", "posts"...)
// query    = סינון (למשל "?userId=1")
// pageSize = כמה פריטים להביא בכל פעם (0 = הכול בבת אחת)
function useResource(resource, query = "", pageSize = 0) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // להביא: העמוד הראשון (או הכול), כשהדף נפתח או כשהסינון משתנה
  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await getData(buildPath(resource, query, pageSize, 1));
        setItems(data);
        setPage(1);
        setHasMore(pageSize > 0 && data.length === pageSize);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [resource, query, pageSize]);

  // להביא עוד: העמוד הבא, ולהוסיף לסוף הרשימה
  async function loadMore() {
    try {
      const nextPage = page + 1;
      const data = await getData(buildPath(resource, query, pageSize, nextPage));

      // מוסיפים רק פריטים שעוד לא קיימים ברשימה
      setItems((prev) => [
        ...prev,
        ...data.filter((newItem) => !prev.some((item) => item.id === newItem.id)),
      ]);
      setPage(nextPage);
      setHasMore(data.length === pageSize);
    } catch (err) {
      setError(err.message);
    }
  }

  // להוסיף: שולחים לשרת, ומוסיפים לרשימה את מה שחזר (עם id)
  async function addItem(newItem) {
    try {
      const saved = await addData(resource, newItem);
      setItems((prev) => [...prev, saved]);
    } catch (err) {
      setError(err.message);
    }
  }

  // לעדכן: שולחים לשרת, ומחליפים ברשימה את הפריט הישן בחדש
  async function updateItem(id, changes) {
    try {
      const updated = await updateData(resource, id, changes);
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
    } catch (err) {
      setError(err.message);
    }
  }

  // למחוק: מוחקים בשרת, ומוציאים מהרשימה
  async function removeItem(id) {
    try {
      await deleteData(resource, id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return {
    items,
    loading,
    error,
    addItem,
    updateItem,
    removeItem,
    loadMore,
    hasMore,
  };
}

export default useResource;