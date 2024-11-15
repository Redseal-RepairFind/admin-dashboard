"use client";

import React, { ReactNode } from "react";
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import { UserProvider } from "context/user-context";
import { CheckedProvider } from "context/checked-context";

const queryClient = new QueryClient();

function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <CheckedProvider>{children}</CheckedProvider>
      </UserProvider>
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </QueryClientProvider>
  );
}

export default ClientLayout;
