const BASE_URL = "http://localhost:3000";

async function request(path, method = "GET", body) {
  const options = { method };

  if (body) {
    options.headers = { "Content-Type": "application/json" };
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}/${path}`, options);

  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }

  return response.json();
}

export function getData(path) {
  return request(path);
}

export function addData(path, item) {
  return request(path, "POST", item);
}

export function updateData(path, id, changes) {
  return request(`${path}/${id}`, "PATCH", changes);
}

export function deleteData(path, id) {
  return request(`${path}/${id}`, "DELETE");
}
