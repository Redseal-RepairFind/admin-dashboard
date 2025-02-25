"use client";

import { ReactNode } from "react";
import { useLoader } from "@/context/LoaderContext";
import LoadingPage from "./loading";

function GlobalLayout({ children }: { children: ReactNode }) {
  const { isLoading } = useLoader();

  if (isLoading) return <LoadingPage />;
  return <div>{children}</div>;
}

export default GlobalLayout;
