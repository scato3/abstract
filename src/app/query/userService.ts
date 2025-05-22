import { useSuspenseQuery } from "@tanstack/react-query";
import { getUsers } from "../service/userService";

export const useGetUsers = () => {
  return useSuspenseQuery({ queryKey: ["users"], queryFn: getUsers });
};
