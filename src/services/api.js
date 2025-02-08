import axios from "axios";

const API_URL = "http://localhost:5001/api"; // Asegúrate de que el backend está corriendo

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
