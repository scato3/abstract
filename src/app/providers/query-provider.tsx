"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useModal } from "./modal-provider";

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { showModal } = useModal();
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
      },
      mutations: {
        onError: (error) => {
          showModal(
            <div>
              <h1>에러가 발생했습니다</h1>
              <p>{error.message}</p>
            </div>
          );
        },
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
