import React, { useState, useEffect, useRef, ReactNode } from "react";
import ReactDOM from "react-dom";
import { FaEllipsisV } from "react-icons/fa";

let currentOpenMenu: (() => void) | null = null; // Tracks the currently open menu's close handler

const VerticalMenu = ({
  children,
  isBackground,
  width,
  className,
  offset = { x: 10, y: 10 }, // Offset for dropdown position
}: {
  children: ReactNode;
  isBackground: boolean;
  width?: string;
  className?: string;
  offset?: { x: number; y: number };
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  }>({
    top: 0,
    left: 0,
  });
  const menuRef = useRef<HTMLDivElement>(null);

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target as Node) &&
      !(event.target as HTMLElement).closest(".ellipsis-icon")
    ) {
      closeMenu();
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    if (currentOpenMenu === closeMenu) {
      currentOpenMenu = null; // Unset the current open menu
    }
  };

  const handleClick = (event: React.MouseEvent) => {
    // Close any other currently open menu
    if (currentOpenMenu && currentOpenMenu !== closeMenu) {
      currentOpenMenu();
    }

    setMenuPosition({
      top: event.clientY + offset.y, // Apply vertical offset
      left: event.clientX + offset.x, // Apply horizontal offset
    });

    setIsMenuOpen((prev) => {
      const newState = !prev;
      if (newState) {
        currentOpenMenu = closeMenu; // Set this menu as the current open one
      }
      return newState;
    });
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

  const dropdown = (
    <div
      ref={menuRef}
      style={{
        position: "absolute",
        top: menuPosition.top,
        left: menuPosition.left,
        zIndex: 1000,
      }}
      className={`${
        width || "min-w-[150px]"
      } h-auto ease-in-out transition-all overflow-hidden origin-top-right bg-white rounded-md shadow`}
    >
      {children}
    </div>
  );

  return (
    <div className={`relative ${className}`} style={{ zIndex: 1000 }}>
      <FaEllipsisV
        className={`cursor-pointer ellipsis-icon ${
          isBackground ? "text-blue-500" : ""
        }`}
        onClick={handleClick}
      />
      {isMenuOpen && ReactDOM.createPortal(dropdown, document.body)}{" "}
      {/* Render outside */}
    </div>
  );
};

export default VerticalMenu;
