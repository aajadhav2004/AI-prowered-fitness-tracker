import axios from "axios";

// Base URL for API requests - points to /api/user for the api instance
const BASE_URL = process.env.REACT_APP_API_URL 
  ? `${process.env.REACT_APP_API_URL}/user`
  : "http://localhost:8080/api/user";

// Create an Axios instance for /api/user routes
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
