"use client";

import React, { ReactNode } from "react";
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import { UserProvider } from "context/user-context";
import { CheckedProvider } from "context/checked-context";
import { LoaderProvider } from "@/context/LoaderContext";
import GlobalLayout from "./Global";
import { FilterProvider } from "@/context/filter-context";

const queryClient = new QueryClient();

function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <LoaderProvider>
          <GlobalLayout>
            <FilterProvider>
              <CheckedProvider>{children}</CheckedProvider>
            </FilterProvider>
          </GlobalLayout>
        </LoaderProvider>
      </UserProvider>
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </QueryClientProvider>
  );
}

export default ClientLayout;
