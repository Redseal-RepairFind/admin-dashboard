import { auth } from "../api/auth";
import { useMutation } from "react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { UserContext } from "@/context/user-context";
import Cookies from "js-cookie";
import { getMessaging, getToken, isSupported } from "firebase/messaging";
import { requestNotificationPermission } from "@/lib/firebase/firebase"; // Update with your actual path

const useAuth = () => {
  const { mutateAsync: Login } = useMutation(auth.login);
  const { mutateAsync: Register } = useMutation(auth.register);
  const { mutateAsync: ForgotPassword } = useMutation(auth.forgotPassword);
  const { mutateAsync: ResetPassword } = useMutation(auth.resetPassword);
  const { mutateAsync: ChangePassword } = useMutation(auth.changePassword);
  const { mutateAsync: VerifyEmail } = useMutation(auth.verifyEmail);

  const { setCurrentUser } = useContext(UserContext);
  const router = useRouter();

  // Get FCM Token with proper typing
  const getFCMToken = async (): Promise<string | null> => {
    try {
      const fcmToken = await requestNotificationPermission();

      return fcmToken;
    } catch (error) {
      console.error("FCM Token Error:", error);
      return null;
    }
  };

  const handleLogin = async (values: any) => {
    try {
      // Get FCM token before login
      const deviceToken = await getFCMToken();

      // Prepare login payload with device token
      const loginPayload = {
        ...values,
        deviceToken: deviceToken,
      };

      // Execute login mutation
      const data = await Login(loginPayload);

      // Handle user session
      setCurrentUser(data?.profile);
      sessionStorage.setItem("userToken", data?.Token);
      sessionStorage.setItem(
        "repairfind_session_user",
        JSON.stringify(data?.profile)
      );
      Cookies.set("user", JSON.stringify(data?.profile), { expires: 1 });

      // Handle weak password case
      if (data?.profile?.hasWeakPassword) {
        toast.error("Kindly change your password...");
        return router.push(`/change-password?email=${values?.email}`);
      }

      // Redirect on success
      router.push("/");
      toast.success(data?.message);
    } catch (e: any) {
      console.error("Login Error:", e);
      toast.remove();
      toast.error(e?.response?.data?.message || "Login failed");
    }
  };

  // Rest of your authentication functions
  const handleRegister = async (values: any) => {
    try {
      const data = await Register(values);
      router.push(`/verify-email?id=${values?.email}`);
      toast.success(data?.message);
    } catch (e: any) {
      console.error("Registration Error:", e);
      toast.remove();
      toast.error(e?.response?.data?.message);
    }
  };

  const handleForgotPassword = async (values: any) => {
    try {
      const data = await ForgotPassword(values);
      router.push(`/reset-password?email=${values.email}`);
      toast.success(data?.message);
    } catch (e: any) {
      console.error("Forgot Password Error:", e);
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
