import axios from "axios";
import { apiBaseUrl } from "./config";

export const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
export type ApiResponse<T> = {
  success: boolean;
  data: T;
  msg?: string;
};
