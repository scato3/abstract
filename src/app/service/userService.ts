import api from "../lib/api";

export interface User {
  id: number;
  name: string;
  age: number;
  job: string;
}

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get<User[]>("/users");
    return response.data;
  } catch (error) {
    console.error("API error:", error);
    return [];
  }
};
