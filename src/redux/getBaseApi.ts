import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "./baseUrl";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: getBaseUrl(),
    timeout: 30000, // 30 second timeout
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      const verifyToken = localStorage.getItem("verifyToken");
      if (verifyToken) {
        headers.set("Authorization", verifyToken);
      }
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: [
    "AUTH",
    "USERS",
    "STUDY",
    "CATEGORIES",
    "MATERIALS",
    "SUPPORT",
    "COMMUNITY",
    "OVERVIEW",
    "EXAMINATION",
    "NOTIFICATION",
  ],
});

export const imageUrl = getBaseUrl();
