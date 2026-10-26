import axios from "axios";

/** Shared HTTP client. */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/",
  headers: { "Content-Type": "application/json" },
  timeout: 10_000,
});
