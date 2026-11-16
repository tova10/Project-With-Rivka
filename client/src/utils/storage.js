const USER_KEY = "currentUser";

// שמירת המשתמש
export function saveUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// קריאת המשתמש (אם אין, מחזיר null)
export function getUser() {
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
}

// מחיקת המשתמש
export function removeUser() {
  localStorage.removeItem(USER_KEY);
}