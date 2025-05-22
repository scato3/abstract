import { useMutation } from "@tanstack/react-query";
import { post } from "../service/get";

export const usePost = () => {
  return useMutation({ mutationFn: post });
};
