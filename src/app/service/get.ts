import api from "../lib/api";

export interface Post {
  title: string;
  body: string;
  userId: number;
}

export interface ApiResponse {
  data: Post[];
}

export const post = async (data: Post) => {
  try {
    const response = await api.post<ApiResponse>("/users", data);
    return response.data;
  } catch (error) {
    console.error("API error:", error);
  }
};
