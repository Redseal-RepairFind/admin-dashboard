import { auth } from "../api/auth";
import { useMutation } from "react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const useAuth = () => {
  const { mutateAsync: Login } = useMutation(auth.login);
  const { mutateAsync: ForgotPassword } = useMutation(auth.forgotPassword);

  const router = useRouter();

  const handleLogin = async (values: any) => {
    // console.log(values);
    try {
      const data = await Login(values);
      //   console.log(data);
      sessionStorage.setItem("userToken", data?.Token);
      sessionStorage.setItem(
        "repairfind_session_user",
        JSON.stringify(data?.profile)
      );
      router.push("/");
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
      router.push("/auth/reset-password");
      toast.success(data?.message);
    } catch (e: any) {
      console.log(e);
      toast.remove();
      toast.error(e?.response?.data?.message);
    }
  };
  return { handleLogin, handleForgotPassword };
};

export default useAuth;
