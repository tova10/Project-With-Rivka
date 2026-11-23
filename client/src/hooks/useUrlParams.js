import { useSearchParams } from "react-router-dom";

// Hook לערכים שנשמרים בכתובת (?sort=title&q=abc), כדי שיישארו אחרי ריענון
// defaults = הערכים כשאין כלום בכתובת, למשל { sort: "id", q: "" }
function useUrlParams(defaults) {
  const [searchParams, setSearchParams] = useSearchParams();

  // הערכים הנוכחיים: מהכתובת, ואם אין - ברירת המחדל
  const params = {};
  for (const key in defaults) {
    params[key] = searchParams.get(key) ?? defaults[key];
  }

  // עדכון ערך אחד או כמה ביחד, למשל setParams({ by: "id", q: "" })
  function setParams(changes) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        for (const key in changes) {
          if (changes[key] === defaults[key]) next.delete(key); // ברירת מחדל לא נכתבת בכתובת
          else next.set(key, changes[key]);
        }
        return next;
      },
      { replace: true } // לא ממלאים את ההיסטוריה בכל הקשה
    );
  }

  return [params, setParams];
}

export default useUrlParams;
