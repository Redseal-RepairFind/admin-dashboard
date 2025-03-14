import { auth } from "../api/auth";
import { useMutation } from "react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { UserContext } from "@/context/user-context";

import Cookies from "js-cookie";

const useAuth = () => {
  const { mutateAsync: Login } = useMutation(auth.login);
  const { mutateAsync: Register } = useMutation(auth.register);
  const { mutateAsync: ForgotPassword } = useMutation(auth.forgotPassword);
  const { mutateAsync: ResetPassword } = useMutation(auth.resetPassword);
  const { mutateAsync: ChangePassword } = useMutation(auth.changePassword);
  const { mutateAsync: VerifyEmail } = useMutation(auth.verifyEmail);

  const { setCurrentUser } = useContext(UserContext);

  const router = useRouter();

  const handleLogin = async (values: any) => {
    // console.log(values);
    try {
      const data = await Login(values);
      // console.log(data);

      setCurrentUser(data?.profile);
      sessionStorage.setItem("userToken", data?.Token);
      sessionStorage.setItem(
        "repairfind_session_user",
        JSON.stringify(data?.profile)
      );
      Cookies.set("user", JSON.stringify(data?.profile), { expires: 1 });
      if (data?.profile?.hasWeakPassword) {
        toast.error("Kindly change your password...");
        return router.push(`/change-password?email=${values?.email}`);
      }
      router.push("/");
      toast.success(data?.message);
    } catch (e: any) {
      console.log(e);
      toast.remove();
      toast.error(e?.response?.data?.message);
    }
  };

  const handleRegister = async (values: any) => {
    // console.log(values);
    try {
      const data = await Register(values);
      router.push(`/verify-email?id=${values?.email}`);
      toast.success(data?.message);
    } catch (e: any) {
      console.log(e);
      toast.remove();
      toast.error(e?.response?.data?.message);
    }
  };

  const handleForgotPassword = async (values: any) => {
    try {
      const data = await ForgotPassword(values);
      //   console.log(data);
      router.push(`/reset-password?email=${values.email}`);
      toast.success(data?.message);
    } catch (e: any) {
      console.log(e);
      toast.remove();
      toast.error(e?.response?.data?.message);
    }
  };
  return {
    handleLogin,
    handleRegister,
    handleForgotPassword,
    ResetPassword,
    ChangePassword,
    VerifyEmail,
  };
};

export default useAuth;
