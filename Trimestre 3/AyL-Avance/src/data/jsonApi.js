const API_URL = "http://localhost:3001";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}/${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Error en ${path}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function readCollection(name) {
  return request(name);
}

export function createItem(name, data) {
  return request(name, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateItem(name, id, data) {
  return request(`${name}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function patchItem(name, id, data) {
  return request(`${name}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function removeItem(name, id) {
  return request(`${name}/${id}`, {
    method: "DELETE",
  });
}
