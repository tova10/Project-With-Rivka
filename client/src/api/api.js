// כתובת השרת: נלקחת ממשתנה הסביבה VITE_API_URL (בקובץ .env), ואם אין - ברירת מחדל
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}/${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }

  return response.json();
}

export function getData(path) {
  return request(path);
}

export function addData(path, item) {
  return request(path, {
    method: "POST",
    body: JSON.stringify(item),
  });
}

export function updateData(path, id, changes) {
  return request(`${path}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(changes),
  });
}

export function deleteData(path, id) {
  return request(`${path}/${id}`, {
    method: "DELETE",
  });
}