// סינון: מחזיר רק את הפריטים שמתאימים לחיפוש
// search = { field: "title", text: "abc" }
export function filterItems(items, search) {
  const { field, text } = search;

  if (!text) return items;

  return items.filter((item) => {
    // id ומצב ביצוע: התאמה מדויקת
    if (field === "id" || field === "completed") {
      return String(item[field]) === text;
    }
    // טקסט: מכיל את מה שחיפשו, בלי הבדל בין אותיות גדולות לקטנות
    return String(item[field]).toLowerCase().includes(text.toLowerCase());
  });
}

// מיון: מחזיר רשימה חדשה ממוינת לפי השדה שנבחר
export function sortItems(items, field) {
  return [...items].sort((a, b) => {
    if (a[field] < b[field]) return -1;
    if (a[field] > b[field]) return 1;
    return 0;
  });
}