import { useMutation } from "@tanstack/react-query";
import { postForm } from "../service/formService";

export const useFormService = () => {
  return useMutation({
    mutationFn: postForm,
  });
};
