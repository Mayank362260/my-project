import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getMessages = () => API.get("/messages");
export const sendMessage = (data) => API.post("/messages", data);

