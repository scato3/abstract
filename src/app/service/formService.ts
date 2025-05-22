import api from "../lib/api";
import { FormValues } from "../lib/schema";

export interface FormSubmitResponse {
  success: boolean;
  message: string;
  errors?: Record<string, unknown>;
}

export const postForm = async (data: FormValues) => {
  try {
    const response = await api.post<FormSubmitResponse>("/form", data);
    return response.data;
  } catch (error) {
    console.error("API error:", error);
  }
};
