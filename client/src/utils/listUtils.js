// סינון רשימה: field = לפי איזה שדה, text = מה מחפשים
export function filterItems(items, field, text) {
  if (!text) return items;

  // מצב ביצוע: "true" / "false" בדיוק
  if (field === "completed") {
    return items.filter((item) => String(item.completed) === text);
  }

  return items.filter((item) =>
    String(item[field]).toLowerCase().includes(text.toLowerCase())
  );
}

// מיון רשימה לפי שדה. numeric = מספרים ממוינים כמספרים (9 לפני 10)
export function sortItems(items, field) {
  return [...items].sort((a, b) =>
    String(a[field]).localeCompare(String(b[field]), undefined, { numeric: true })
  );
}
