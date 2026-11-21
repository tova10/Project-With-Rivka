import { useEffect, useRef, useState } from "react";
import { getData, addData, updateData, deleteData } from "../api/api";
import { getCache, setCache, clearResource } from "../utils/cache";

// מצב התחלתי כשאין מידע
const EMPTY = { items: [], offset: 0, hasMore: false };

// בונה את הכתובת לשרת. אם יש pageSize, מוסיפים מאיזה מקום להתחיל וכמה להביא
function buildPath(resource, query, pageSize, start) {
  let path = `${resource}${query}`;

  if (pageSize > 0) {
    const separator = query ? "&" : "?";
    path += `${separator}_start=${start}&_limit=${pageSize}`;
  }

  return path;
}

// Hook גנרי לכל רשימה: מביא, מוסיף, מעדכן ומוחק - עם cache
// resource = שם המגירה ("todos", "posts"...)
// query    = סינון (למשל "?userId=1")
// pageSize = כמה פריטים להביא בכל פעם (0 = הכול בבת אחת)
function useResource(resource, query = "", pageSize = 0) {
  // מפתח ייחודי לכל רשימה, למשל: "todos?userId=1|0"
  const cacheKey = `${resource}${query}|${pageSize}`;

  // data = הפריטים + מאיפה להמשיך + האם יש עוד
  const [data, setData] = useState(() => getCache(cacheKey) || EMPTY);
  const [loading, setLoading] = useState(() => !getCache(cacheKey));
  const [error, setError] = useState("");

  // המפתח של הרינדור הקודם, כדי לזהות מעבר לרשימה אחרת
  const [prevKey, setPrevKey] = useState(cacheKey);                  // ← lint 5

  // האם "הבא עוד" באמצע (להצגה: כפתור מושבת + "Loading...")
  const [loadingMore, setLoadingMore] = useState(false);             // ← באג 6

  // עותק עדכני תמיד של data, כדי שפעולות מהירות ברצף לא ידרסו זו את זו
  const dataRef = useRef(data);

  // האם "הבא עוד" באמצע (לבדיקה מיידית: נעילה נגד לחיצה כפולה)
  const loadingMoreRef = useRef(false);                              // ← באג 6

  // עברנו לרשימה אחרת: מאפסים מיד, עוד לפני שמשהו מוצג
  if (prevKey !== cacheKey) {                                        // ← lint 5
    const cached = getCache(cacheKey);
    setPrevKey(cacheKey);
    setData(cached || EMPTY);
    setLoading(!cached);
    setError("");
  }

  // שמירת שינוי: גם בתצוגה וגם ב-cache
  function apply(changes) {
    const next = { ...dataRef.current, ...changes };
    dataRef.current = next;
    setData(next);
    setCache(cacheKey, next);
  }

  // טעינה: אם אין ב-cache - פונים לשרת
  useEffect(() => {
    let ignore = false;

    const cached = getCache(cacheKey);
    dataRef.current = cached || EMPTY;                               // ← lint 5
    if (cached) return; // כבר יש מידע ב-state, אין מה לעשות          // ← lint 5

    async function load() {
      try {                                                          // ← lint 5: בלי setLoading/setError כאן
        const items = await getData(buildPath(resource, query, pageSize, 0));
        if (ignore) return;
        const next = {
          items,
          offset: items.length,
          hasMore: pageSize > 0 && items.length === pageSize,
        };
        dataRef.current = next;
        setData(next);
        setCache(cacheKey, next);
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
  }, [cacheKey, resource, query, pageSize]);

  // להביא עוד: ממשיכים מהמקום שעצרנו
  async function loadMore() {
    // כבר מביאים: מתעלמים מלחיצה נוספת
    if (loadingMoreRef.current) return;                              // ← באג 6
    loadingMoreRef.current = true;                                   // ← באג 6
    setLoadingMore(true);                                            // ← באג 6

    try {
      const newItems = await getData(
        buildPath(resource, query, pageSize, dataRef.current.offset)
      );
      const current = dataRef.current;
      // מוסיפים רק פריטים שעוד לא קיימים ברשימה
      const fresh = newItems.filter(
        (newItem) => !current.items.some((item) => item.id === newItem.id)
      );
      apply({
        items: [...current.items, ...fresh],
        offset: current.offset + newItems.length,
        hasMore: newItems.length === pageSize,
      });
    } catch (err) {
      setError(err.message);
    } finally {                                                      // ← באג 6
      // משחררים את הנעילה - גם אם הייתה שגיאה
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }

  // אחרי כל שינוי: רשימות אחרות של אותו resource כבר לא מעודכנות
  function invalidateOthers() {
    clearResource(resource, cacheKey);
  }

  async function addItem(newItem) {
    try {
      const saved = await addData(resource, newItem);
      apply({ items: [...dataRef.current.items, saved] });
      invalidateOthers();
    } catch (err) {
      setError(err.message);
    }
  }

  async function updateItem(id, changes) {
    try {
      const updated = await updateData(resource, id, changes);
      apply({
        items: dataRef.current.items.map((item) => (item.id === id ? updated : item)),
      });
      invalidateOthers();
    } catch (err) {
      setError(err.message);
    }
  }

  async function removeItem(id) {
    try {
      await deleteData(resource, id);
      const { items, offset } = dataRef.current;
      apply({
        items: items.filter((item) => item.id !== id),
        // הרשימה בשרת התקצרה באחד - גם המקום שממנו ממשיכים זז אחורה
        offset: pageSize > 0 ? Math.max(offset - 1, 0) : offset,
      });
      invalidateOthers();
    } catch (err) {
      setError(err.message);
    }
  }

  return {
    items: data.items,
    loading,
    error,
    addItem,
    updateItem,
    removeItem,
    loadMore,
    loadingMore,                                                     // ← באג 6
    hasMore: data.hasMore,
  };
}

export default useResource;