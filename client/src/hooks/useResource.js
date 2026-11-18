import { useEffect, useState } from "react";
import { getData, addData, updateData, deleteData } from "../api/api";

// בונה את הכתובת לשרת. אם יש pageSize, מוסיפים מאיזה מקום להתחיל וכמה להביא
// start = כמה פריטים לדלג (0 = מההתחלה)
function buildPath(resource, query, pageSize, start) {
  let path = `${resource}${query}`;

  if (pageSize > 0) {
    const separator = query ? "&" : "?";
    path += `${separator}_start=${start}&_limit=${pageSize}`;
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
  const [hasMore, setHasMore] = useState(false);

  // כמה פריטים כבר עברנו ברשימה שבשרת (מאיפה להמשיך בפעם הבאה)
  const [offset, setOffset] = useState(0);

  // להביא: הקבוצה הראשונה (או הכול), כשהדף נפתח או כשהסינון משתנה
  useEffect(() => {
    // אם הסינון השתנה לפני שהתשובה חזרה, מתעלמים מהתשובה הישנה
    let ignore = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await getData(buildPath(resource, query, pageSize, 0));
        if (ignore) return;
        setItems(data);
        setOffset(data.length);
        setHasMore(pageSize > 0 && data.length === pageSize);
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [resource, query, pageSize]);

  // להביא עוד: ממשיכים מהמקום שעצרנו, ומוסיפים לסוף הרשימה
  async function loadMore() {
    try {
      const data = await getData(buildPath(resource, query, pageSize, offset));

      // מוסיפים רק פריטים שעוד לא קיימים ברשימה
      setItems((prev) => [
        ...prev,
        ...data.filter((newItem) => !prev.some((item) => item.id === newItem.id)),
      ]);
      setOffset((prev) => prev + data.length);
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

      // הרשימה בשרת התקצרה באחד, אז גם המקום שממנו ממשיכים זז אחורה
      // (בלי זה, "טען עוד" היה מדלג על פריט אחד)
      if (pageSize > 0) {
        setOffset((prev) => Math.max(prev - 1, 0));
      }
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
