"use client";

import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !isClient) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="rounded-lg shadow-lg  max-w-[500px] p-6 relative bg-secondary-white w-[300px] md:w-[480px] xl:w-[500px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          {title && (
            <h2
              className={`text-xl font-semibold ${
                title.toLowerCase().includes("delete") ? "text-accent-600" : ""
              }`}
            >
              {title}
            </h2>
          )}
          <button
            className="text-2xl font-bold text-gray-600 hover:text-gray-800 border border-grey-500 h-6 flex items-center justify-center w-6 rounded-full"
            onClick={onClose}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>,
    document.body
  );
}

export default Modal;
