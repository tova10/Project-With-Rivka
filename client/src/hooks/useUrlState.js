import { useSearchParams } from "react-router-dom";

// שמירת ערך בכתובת (?key=value), כדי שיישאר אחרי ריענון
// key          = שם הפרמטר בכתובת
// defaultValue = ערך ברירת המחדל (לא נכתב בכתובת)
export function useUrlState(key, defaultValue = "") {
  const [params, setParams] = useSearchParams();
  const value = params.get(key) ?? defaultValue;

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
export function useUrlSearch(defaultField = "title") {
  const [params, setParams] = useSearchParams();
  const search = {
    field: params.get("by") ?? defaultField,
    text: params.get("q") ?? "",
  };

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
