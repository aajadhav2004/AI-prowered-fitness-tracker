import axios from "axios";

// Base URL for API requests
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api/user";

// Create an Axios instance
const api = axios.create({
  baseURL: BASE_URL,
});

// Set or remove Authorization header globally
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export default api;
