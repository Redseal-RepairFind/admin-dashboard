import { ReactNode } from "react";

function layout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full h-screen flex flex-col bg-[#f8f8f8] justify-center items-center">
      {children}
    </div>
  );
}

export default layout;
