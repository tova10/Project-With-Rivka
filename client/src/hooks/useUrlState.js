import { useSearchParams } from "react-router-dom";

// שמירת ערך בכתובת (?key=value), כדי שיישאר אחרי ריענון
// key           = שם הפרמטר בכתובת
// defaultValue  = ערך ברירת המחדל (לא נכתב בכתובת)
// allowedValues = (לא חובה) רשימת הערכים המותרים. ערך אחר בכתובת = ברירת המחדל
export function useUrlState(key, defaultValue = "", allowedValues = null) {    // ← נוסף allowedValues
  const [params, setParams] = useSearchParams();

  let value = params.get(key) ?? defaultValue;
  if (allowedValues && !allowedValues.includes(value)) {                  // ← חדש
    value = defaultValue;
  }

  function setValue(newValue) {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (newValue === defaultValue || newValue === "") next.delete(key);
        else next.set(key, newValue);
        return next;
      },
      { replace: true } // לא ממלאים את ההיסטוריה בכל הקשה
    );
  }

  return [value, setValue];
}

// חיפוש בכתובת: by = לפי איזה שדה, q = הטקסט
// (שני הפרמטרים מתעדכנים יחד, בפעולה אחת)
// defaultField  = השדה שנבחר כברירת מחדל
// allowedFields = רשימת השדות שמותר לחפש לפיהם. שדה אחר בכתובת = ברירת המחדל
export function useUrlSearch(defaultField, allowedFields) {                   // ← נוסף allowedFields
  const [params, setParams] = useSearchParams();

  // השדה: רק אם הוא ברשימה המותרת                                         // ← חדש
  let field = params.get("by") ?? defaultField;
  if (!allowedFields.includes(field)) {
    field = defaultField;
  }

  // הטקסט: במצב ביצוע מותרים רק "true" / "false" (אחרת - בלי סינון)      // ← חדש
  let text = params.get("q") ?? "";
  if (field === "completed" && text !== "true" && text !== "false") {
    text = "";
  }

  const search = { field, text };                                         // ← שונה

  function setSearch(newSearch) {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("by", newSearch.field);
        if (newSearch.text) next.set("q", newSearch.text);
        else next.delete("q");
        return next;
      },
      { replace: true }
    );
  }

  return [search, setSearch];
}