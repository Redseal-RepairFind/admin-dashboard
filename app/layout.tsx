import { Providers } from "@/lib/redux/providers";
import "./globals.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <html lang="en">
        <body className="text-[#333]">
          <ToastContainer limit={1} />
          {children}
        </body>
      </html>
    </Providers>
  );
}
