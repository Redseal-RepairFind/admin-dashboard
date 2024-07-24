import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

type PasswordFieldProps = {
  title?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ title, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const toggleShowPassword = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      e.preventDefault();
      setShowPassword(!showPassword);
    };

    return (
      <div className="w-full relative">
        <span
          onClick={toggleShowPassword}
          style={{ top: "50%", right: "10px", transform: "translateY(-50%)" }}
          className="absolute cursor-pointer translate-y-[-50%] top-[50%] right-2"
        >
          {showPassword ? <FaEye /> : <FaEyeSlash />}
        </span>
        <input
          ref={ref}
          type={showPassword ? "text" : "password"}
          {...props}
          // placeholder="Enter your password"
          className="block w-full border border-gray-200 focus:ring-0 focus:border-black duration-200 rounded-md py-3 px-4 sm:text-sm outline-none"
        />
      </div>
    );
  }
);

PasswordField.displayName = "PasswordField";

export default PasswordField;
