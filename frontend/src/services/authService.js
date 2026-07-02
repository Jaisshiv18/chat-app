const API_BASE_URL = "http://localhost:8080/api";


export async function login(username, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Login failed. Please try again.");
  }

  return response.json(); // { username, token }
}


export async function fetchMessageHistory() {
  const response = await fetch(`${API_BASE_URL}/messages`);

  if (!response.ok) {
    throw new Error("Failed to load message history.");
  }

  return response.json();
}
