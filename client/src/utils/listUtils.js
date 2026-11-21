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
    const x = a[field];
    const y = b[field];

    // טקסט: מיון לפי סדר האלפבית של השפה, בלי הבדל בין אותיות גדולות לקטנות
    // numeric: true = מספרים בתוך טקסט ממוינים לפי ערכם ("task 2" לפני "task 10")
    if (typeof x === "string" && typeof y === "string") {
      return x.localeCompare(y, undefined, { numeric: true, sensitivity: "base" });
    }

    // מספרים (id) ו-true/false (completed): השוואה רגילה
    if (x < y) return -1;
    if (x > y) return 1;
    return 0;
  });
}