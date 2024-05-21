"use client";
import { login } from "@/lib/api/api";
import { ILoginData } from "@/lib/types";
import logo from "@/public/logo.svg";
import Image from "next/image";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingTemplate from "../layout/loading";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setAdminData } from "@/lib/redux/slices/auth";

export default function Login() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [authenticated, setAuthenticated] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token !== null && token !== undefined) {
      redirect("/");
    } else {
      setAuthenticated(false);
    }
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    login(formField)
      .then((response) => {
        if (response?.success) {
          console.log(response);
          const profileData = response.profileData;
          localStorage.setItem("firstName", profileData.firstName);
          localStorage.setItem("lastName", profileData.lastName);
          localStorage.setItem("image", profileData.image);
          localStorage.setItem("isSuperAdmin", profileData.superAdmin.toString);
          localStorage.setItem("email", profileData.email);
        }
      })
      .finally(() => router.push("/"));
  };

  const [formField, setFormField] = useState<ILoginData>({
    email: "",
    password: "",
  });

  if (authenticated) {
    return <LoadingTemplate />;
  } else {
    return (
      <>
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <div className="flex flex-col items-center py-8">
              <Image
                src={logo}
                alt="Logo"
                width={110}
                height={110}
                className="w-[110px] h-[110px]"
              />
            </div>

            <h2 className="mt-1 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign in
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formField.email}
                    onChange={(e) =>
                      setFormField({ ...formField, email: e.target.value })
                    }
                    required
                    className="block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo/10 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Password
                  </label>
                  <div className="text-sm">
                    <a
                      href="/auth/forget-password"
                      className="font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={formField.password}
                    onChange={(e) =>
                      setFormField({ ...formField, password: e.target.value })
                    }
                    required
                    className="block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo/10 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-[#262626] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#444] outline-none "
                >
                  Sign in
                </button>
              </div>
            </form>

            <p className="mt-10 text-center text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <a
                href="/auth/signup"
                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >
                Create an account
              </a>
            </p>
          </div>
        </div>
      </>
    );
  }
}
