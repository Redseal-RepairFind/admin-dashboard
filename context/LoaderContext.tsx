"use client";

import { useRouter, usePathname } from "next/navigation";
import React, { createContext, useContext, useState, useEffect } from "react";

const LoaderContext = createContext({
  isLoading: false,
  setLoading: (loading: boolean) => {},
  handleNavigation: (route: string) => {},
  // Add more methods as needed...
});

export const LoaderProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (route: string) => {
    setLoading(true);
    router.push(route);
  };

  useEffect(() => {
    setLoading(false);
  }, [pathname]);

  return (
    <LoaderContext.Provider value={{ isLoading, setLoading, handleNavigation }}>
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => useContext(LoaderContext);
