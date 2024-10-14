import React, { useState, useEffect, useRef, ReactNode } from "react";
import { FaEllipsisV } from "react-icons/fa";

const VerticalMenu = ({
  children,
  isBackground,
  width,
  className,
  top,
}: {
  children: ReactNode;
  isBackground: boolean;
  width?: string;
  className?: string;
  top?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<any>();

  const handleOutsideClick = (event: any) => {
    event.stopPropagation();
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isMenuOpen]);

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <FaEllipsisV
        className={`cursor-pointer ${isBackground ? "text-blue-500" : ""}`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      />
      {isMenuOpen && (
        <div
          style={{ right: "20px", top: top || "-50px", zIndex: "1000" }}
          className={`absolute ${
            width ? width : "min-w-[150px]"
          } mt-1 h-auto ease-in-out transition-all overflow-hidden origin-top-right bg-white rounded-md shadow`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default VerticalMenu;
