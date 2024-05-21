"use client";
import { updateProfile } from "@/lib/api/api";
import { IProfileData } from "@/lib/types";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";

const ProfileForm = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const prevFirstName = localStorage.getItem("firstName") || "";
  const prevLastName = localStorage.getItem("lastName") || "";
  const prevImage = localStorage.getItem("image") || "";
  const email = localStorage.getItem("email") || "";
  const router = useRouter();
  const [formData, setFormData] = useState<IProfileData>({
    email,
    firstName: prevFirstName,
    lastName: prevLastName,
    password: "",
    profileImg: prevImage,
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);

  const formDataObj = new FormData();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    setProfileImage(file ? URL.createObjectURL(file) : null);

    // const files = event.target.files;
    // console.log(file);
    setFormData((prevData) => ({
      ...prevData,
      profileImg: file,
    }));
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    formDataObj.append("email", formData.email);
    formDataObj.append("firstName", formData.firstName);
    formDataObj.append("lastName", formData.lastName);
    formDataObj.append("password", formData.password);

    formDataObj.append("profileImg", formData.profileImg || "");

    updateProfile(formDataObj).then((res) => {
      setIsLoading(false);
      if (res?.success) {
        localStorage.removeItem("token");
        router.push("/auth/login");
      }
    });
  };

  return (
    <div className="w-[50%]">
      <form onSubmit={handleSubmit}>
        <div className="col-span-full">
          <label
            htmlFor="photo"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Photo
          </label>
          <input
            id="photo"
            type="file"
            accept="image/*"
            name="profileImg"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <div className="mt-2 flex items-center gap-x-3">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="h-12 w-12 object-cover rounded-full border border-gray-300"
              />
            ) : (
              <FaRegUserCircle
                className="h-12 w-12 text-gray-300"
                aria-hidden="true"
              />
            )}
            <button
              type="button"
              onClick={handleButtonClick}
              className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Change
            </button>
          </div>
        </div>
        <div className="col-span-full mt-5">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            First Name
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="firstName"
              placeholder=""
              onChange={handleInputChange}
              value={formData.firstName}
              className="block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo/10 sm:text-sm sm:leading-6"
            />
          </div>
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Last Name
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="lastName"
              placeholder=""
              onChange={handleInputChange}
              value={formData.lastName}
              className="block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo/10 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="col-span-full mt-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Password
          </label>
          <div className="mt-2">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              placeholder="Password"
              onChange={handleInputChange}
              className="block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo/10 sm:text-sm sm:leading-6"
            />

            <button
              className="text-sm font-[600] text-[#222]/80 mt-2"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide Password" : "Show Password"}
            </button>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Cancel
          </button>
          <button
            disabled={isLoading}
            type="submit"
            className="rounded-md bg-indigo-600 px-8 py-2 text-sm font-semibold 
            text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 
            focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
