import axios from "axios";

export async function logActivity(action, details = {}) {
  const token = localStorage.getItem("token");
  if (!token) return; // <-- if token is missing, nothing will be sent

  await fetch(`${import.meta.env.VITE_BACKEND_URL}/audit-log`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // must send token
    },
    body: JSON.stringify({ action, details }),
  });
}
