import type { Metadata } from "next";
import { Providers } from "@/lib/redux/providers";
import "./globals.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "react-hot-toast";
import ClientLayout from "./client-layout";

export const metadata: Metadata = {
  title: "Repairfind Admin",
  description: "Repairfind Admin Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <html lang="en">
        <body>
          <ToastContainer limit={1} />
          <ClientLayout>{children}</ClientLayout>
          <Toaster
            toastOptions={{
              style: {
                fontFamily: "'Jost', sans-serif",
                fontSize: "12px",
                fontWeight: "700",
              },
              success: {
                iconTheme: {
                  primary: "#000000",
                  secondary: "#ffffff",
                },
              },
            }}
          />
        </body>
      </html>
    </Providers>
  );
}
