import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import {
  IContractorPostData,
  IForgotPasswordData,
  ILoginData,
  IQuestion,
  IEditQuestion,
  IResetPasswordData,
  ISignupData,
  IVerifyEmailData,
  IGetJobsData,
  IChangeContractorStatusData,
  IGetRevenueAnalysisParams,
} from "../types";
import { toast } from "react-toastify";

// Create an instance of axios with baseURL
const api: AxiosInstance = axios.create({
  baseURL: "https://stingray-app-3vrw8.ondigitalocean.app/admin",
});

// Interceptor to handle request errors
api.interceptors.request.use(
  (config) => {
    // You can modify the request config here (e.g., adding authentication tokens)
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle response errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export const login = async (data: ILoginData) => {
  try {
    const response: AxiosResponse = await api.post("/admin_signin", data);
    localStorage.setItem("token", response?.data.Token);
    const message = response.data.message;
    toast.success(message, {
      position: toast.POSITION.TOP_LEFT,
    });
    return { success: true, profileData: response.data.profile };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const message = error.response.data.message;
        toast.error(message, {
          position: toast.POSITION.TOP_LEFT,
          toastId: "axios-login-error",
        });
        return { success: false, message };
      } else if (error.request) {
        toast.error("Network error. Please check your connection.", {
          position: toast.POSITION.TOP_LEFT,
          toastId: "network",
        });
        return { success: false, message: "network_error" };
      }
    } else {
      console.error("Non-Axios error:", error);
      return { success: false, message: "error" };
    }
  }
};

export const signup = async (data: ISignupData) => {
  try {
    const response: AxiosResponse = await api.post("/admin_signup", data);
    console.log(response);
    const responseData = response.data;
    toast.success(responseData.message + ", OTP has been sent", {
      position: toast.POSITION.TOP_LEFT,
    });
    return { success: true, message: responseData.message };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const message = error.response.data.message;
        toast.error(message, {
          position: toast.POSITION.TOP_LEFT,
          toastId: "axios-signup-error",
        });
        return { success: false, message: message };
      } else if (error.request) {
        toast.error("Network error. Please check your connection.", {
          position: toast.POSITION.TOP_LEFT,
          toastId: "network",
        });
        return { success: false };
      }
    } else {
      toast.error("An error occurred. Please try again.", {
        position: toast.POSITION.TOP_LEFT,
        toastId: "signup-error",
      });
      return { success: false };
    }
  }
};

export const verifyEmail = async (data: IVerifyEmailData) => {
  try {
    const response: AxiosResponse = await api.post(
      "/admin_email_verification",
      data
    );
    console.log(response);
    const responseData = response.data;
    toast.success(responseData.message, {
      position: toast.POSITION.TOP_LEFT,
    });
    return { success: true };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const message = error.response.data.message;
        toast.error(message, {
          position: toast.POSITION.TOP_LEFT,
          toastId: "axios-verfiy-email-error",
        });
        return { success: false };
      } else if (error.request) {
        toast.error("Network error. Please check your connection.", {
          position: toast.POSITION.TOP_LEFT,
          toastId: "network",
        });
        return { success: false };
      }
    } else {
      console.error("Non-Axios error:", error);
      toast.error("An error occurred. Please try again.", {
        position: toast.POSITION.TOP_LEFT,
        toastId: "verfiy-email-error",
      });
      return { success: false };
    }
  }
};

export const forgotPassword = async (data: IForgotPasswordData) => {
  try {
    const response: AxiosResponse = await api.post(
      "/admin_forgot_password",
      data
    );
    console.log(response);
    const responseData = response.data;
    toast.success(responseData.message, {
      position: toast.POSITION.TOP_LEFT,
    });
    return { success: true, message: responseData.message };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const message = error.response.data.message;
        toast.error(message, {
          position: toast.POSITION.TOP_LEFT,
          toastId: "axios-forgotpassword-error",
        });
        return { success: false, message };
      } else if (error.request) {
        toast.error("Network error. Please check your connection.", {
          position: toast.POSITION.TOP_LEFT,
          toastId: "network",
        });
        return { success: false };
      }
    } else {
      console.error("Non-Axios error:", error);
      toast.error("An error occurred. Please try again.", {
        position: toast.POSITION.TOP_LEFT,
        toastId: "forgotpassword-error",
      });
      return { success: false };
    }
  }
};

export const resetPassword = async (data: IResetPasswordData) => {
  try {
    const response: AxiosResponse = await api.post(
      "/admin_reset_password",
      data
    );
    console.log(response);
    const responseData = response.data;
    toast.success(responseData.message, {
      position: toast.POSITION.TOP_LEFT,
    });
    return { success: true, message: responseData.message };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const message = error.response.data.message;
        toast.error(message, {
          position: toast.POSITION.TOP_LEFT,
          toastId: "axios-resetpassword-error",
        });
        return { success: false, message: message };
      } else if (error.request) {
        toast.error("Network error. Please check your connection.", {
          position: toast.POSITION.TOP_LEFT,
          toastId: "network",
        });
        return { success: false };
      }
    } else {
      console.error("Non-Axios error:", error);
      toast.error("An error occurred. Please try again.", {
        position: toast.POSITION.TOP_LEFT,
        toastId: "resetpassword-error",
      });
      return { success: false };
    }
  }
};

export const getCustomerDetail = async (data: IContractorPostData) => {
  try {
    const response: AxiosResponse = await api.get(
      "/admin_get_customer_detail",
      { params: data }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        toast.warning(error.response.data.message, {
          position: toast.POSITION.TOP_LEFT,
          toastId: "axios-get-customer-detail-error",
        });
      } else if (error.request) {
        toast.error("Network error. Please check your connection.", {
          position: toast.POSITION.TOP_LEFT,
          toastId: "network",
        });
      }
    } else {
      toast.error("An error occurred. Please try again.", {
        position: toast.POSITION.TOP_LEFT,
        toastId: "get-customer-detail-error",
      });
    }
  }
};

export const getSingleCustomerDetail = async (data: { customerId: string }) => {
  try {
    const response: AxiosResponse = await api.get(
      "/admin_get_single_customer_detail",
      { params: data }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        toast.warning(error.response.data.message, {
          position: toast.POSITION.TOP_LEFT,
          toastId: "axios-get-single-customer-detail-error",
        });
      } else if (error.request) {
        toast.error("Network error. Please check your connection.", {
          position: toast.POSITION.TOP_LEFT,
          toastId: "network",
        });
      }
    } else {
      toast.error("An error occurred. Please try again.", {
        position: toast.POSITION.TOP_LEFT,
        toastId: "get-single-customer-detail-error",
      });
    }
  }
};

export const getSingleContractorsDetail = async (data: {
  contractorId: string;
}) => {
  try {
    const response: AxiosResponse = await api.get(
      "/admin_get_single_contractor_detail",
      { params: data }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        toast.warning(error.response.data.message, {
          position: toast.POSITION.TOP_LEFT,
          toastId: "axios-get-single-contractor-detail-error",
        });
      } else if (error.request) {
        toast.error("Network error. Please check your connection.", {
          position: toast.POSITION.TOP_LEFT,
          toastId: "network",
        });
      }
    } else {
      toast.error("An error occurred. Please try again.", {
        position: toast.POSITION.TOP_LEFT,
        toastId: "get-single-contractor-detail-error",
      });
    }
  }
};

export const getOverviewDetail = async () => {
  try {
    const response: AxiosResponse = await api.get("/app_detail");

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        toast.warning(error.response.data.message, {
          position: toast.POSITION.TOP_LEFT,
          toastId: "axios-get-overview-detail-error",
        });
      } else if (error.request) {
        toast.error("Network error. Please check your connection.", {
          position: toast.POSITION.TOP_LEFT,
          toastId: "network",
        });
      }
    } else {
      toast.error("An error occurred. Please try again.", {
        position: toast.POSITION.TOP_LEFT,
        toastId: "get-overview-detail-error",
      });
    }
  }
};

export const getContactorDetail = async (data: IContractorPostData) => {
  try {
    const response: AxiosResponse = await api.get(
      "/admin_get_contractor_detail",
      { params: data }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        toast.warning(error.response.data.message, {
          position: toast.POSITION.TOP_LEFT,
          toastId: "axios-get-contractor-detail-error",
        });
      } else if (error.request) {
        toast.error("Network error. Please check your connection.", {
          position: toast.POSITION.TOP_LEFT,
          toastId: "network",
        });
      }
    } else {
      toast.error("An error occurred. Please try again.", {
        position: toast.POSITION.TOP_LEFT,
        toastId: "get-contractor-detail-error",
      });
    }
  }
};

export const getTransactionDetail = async (data: IContractorPostData) => {
  try {
    const response: AxiosResponse = await api.get(
      "/admin_get_transaction_detail",
      { params: data }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response);
      if (error.response) {
        toast.warning(error.response.data.message, {
          position: toast.POSITION.TOP_LEFT,
          toastId: "axios-get-transaction-detail-error",
        });
      } else if (error.request) {
        toast.error("Network error. Please check your connection.", {
          position: toast.POSITION.TOP_LEFT,
          toastId: "network",
        });
      }
    } else {
      toast.error("An error occurred. Please try again.", {
        position: toast.POSITION.TOP_LEFT,
        toastId: "get-transaction-detail-error",
      });
    }
  }
};

export const getSubAdmins = async () => {
  try {
    const response: AxiosResponse = await api.get(
      "/super_admin_get_list_of_admin"
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        toast.warning(error.response.data.message, {
          position: toast.POSITION.TOP_LEFT,
          toastId: "axios-get-sub-admins-error",
        });
      } else if (error.request) {
        toast.error("Network error. Please check your connection.", {
          position: toast.POSITION.TOP_LEFT,
          toastId: "network",
        });
      }
    } else {
      toast.error("An error occurred. Please try again.", {
        position: toast.POSITION.TOP_LEFT,
        toastId: "get-sub-admins-error",
      });
    }
  }
};

export const getAllNotifications = async (data: IContractorPostData) => {
  try {
    const response: AxiosResponse = await api.get("/get_all_notification", {
      params: data,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        toast.warning(error.response.data.message, {
          position: toast.POSITION.TOP_LEFT,
          toastId: "axios-get-all-notifications-error",
        });
      } else if (error.request) {
        toast.error("Network error. Please check your connection.", {
          position: toast.POSITION.TOP_LEFT,
          toastId: "error-get-all-notifications-error",
        });
      }
    } else {
      toast.error("An error occurred. Please try again.", {
        position: toast.POSITION.TOP_LEFT,
        toastId: "get-all-notifications-error",
      });
    }
  }
};

export const getTotalUnseenNotification = async () => {
  try {
    const response: AxiosResponse = await api.get("/get_unseen_notification");
    return { data: response.data, success: true };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        toast.warning(error.response.data.message, {
          position: toast.POSITION.TOP_LEFT,
          toastId: "axios-get-total-notifications-error",
        });
      } else if (error.request) {
        toast.error("Network error. Please check your connection.", {
          position: toast.POSITION.TOP_LEFT,
          toastId: "network",
        });
      }
    } else {
      toast.error("An error occurred. Please try again.", {
        position: toast.POSITION.TOP_LEFT,
        toastId: "get-total-notifications-error",
      });
    }
  }
};

export const viewNotification = async () => {
  try {
    const response: AxiosResponse = await api.post("/view_unseen_notification");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        toast.warning(error.response.data.message, {
          position: toast.POSITION.TOP_LEFT,
          toastId: "axios-view-notifications-error",
        });
      } else if (error.request) {
        toast.error("Network error. Please check your connection.", {
          position: toast.POSITION.TOP_LEFT,
          toastId: "network",
        });
      }
    } else {
      toast.error("An error occurred. Please try again.", {
        position: toast.POSITION.TOP_LEFT,
        toastId: "view-notifications-error",
      });
    }
  }
};

export const validateSubAdmin = async (data: { subAdminId: string }) => {
  try {
    const response: AxiosResponse = await api.post(
      "/super_admin_validate_other_admin",
      data
    );
    console.log(response);
    const responseData = response.data;
    toast.success(responseData.message, {
      position: toast.POSITION.TOP_LEFT,
    });
    return { success: true };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const message = error.response.data.message;
        toast.error(message, {
          position: toast.POSITION.TOP_LEFT,
          toastId: "axios-validate-sub-admin-error",
        });
        return { success: false };
      } else if (error.request) {
        toast.error("Network error. Please check your connection.", {
          position: toast.POSITION.TOP_LEFT,
          toastId: "network",
        });
        return { success: false };
      }
    } else {
      console.error("Non-Axios error:", error);
      toast.error("An error occurred. Please try again.", {
        position: toast.POSITION.TOP_LEFT,
        toastId: "validate-sub-admin-error",
      });
      return { success: false };
    }
  }
};
export const validateAContractorDocument = async (data: {
  contractorDocsId: string;
}) => {
  try {
    const response: AxiosResponse = await api.post(
      "admin_validate_contractor_document",
      data
    );
    const responseData = response.data;
    toast.success(responseData.message, {
      position: toast.POSITION.TOP_LEFT,
    });
    return { success: true };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const message = error.response.data.message;
        toast.error(message, {
          position: toast.POSITION.TOP_LEFT,
          toastId: "axios-validate-contractor-error",
        });
        return { success: false };
      } else if (error.request) {
        toast.error("Network error. Please check your connection.", {
          position: toast.POSITION.TOP_LEFT,
          toastId: "network",
        });
        return { success: false };
      }
    } else {
      console.error("Non-Axios error:", error);
      toast.error("An error occurred. Please try again.", {
        position: toast.POSITION.TOP_LEFT,
        toastId: "validate-contractor-error",
      });
      return { success: false };
    }
  }
};

export const changeContractorStatus = async (
  data: IChangeContractorStatusData
) => {
  try {
    const response: AxiosResponse = await api.post(
      "admin_change_contractor_status",
      data
    );
    const responseData = response.data;
    toast.success(responseData.message, {
      position: toast.POSITION.TOP_LEFT,
    });
    return { success: true };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const message = error.response.data.message;
        toast.error(message, {
          position: toast.POSITION.TOP_LEFT,
          toastId: "axios-change-contractor-error",
        });
        return { success: false };
      } else if (error.request) {
        toast.error("Network error. Please check your connection.", {
          position: toast.POSITION.TOP_LEFT,
          toastId: "network",
        });
        return { success: false };
      }
    } else {
      console.error("Non-Axios error:", error);
      toast.error("An error occurred. Please try again.", {
        position: toast.POSITION.TOP_LEFT,
        toastId: "change-contractor-error",
      });
      return { success: false };
    }
  }
};

export const getSkills = async () => {
  try {
    const response: AxiosResponse = await api.get("/admin_get_skill");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        toast.warning(error.response.data.message, {
          position: toast.POSITION.TOP_LEFT,
          toastId: "axios-get-skills-error",
        });
      } else if (error.request) {
        toast.error("Network error. Please check your connection.", {
          position: toast.POSITION.TOP_LEFT,
          toastId: "network",
        });
      }
    } else {
      toast.error("An error occurred. Please try again.", {
        position: toast.POSITION.TOP_LEFT,
        toastId: "get-skills-error",
      });
    }
  }
};
export const getAllQuestions = async () => {
  try {
    const response: AxiosResponse = await api.get("/admin_get_all_question");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        toast.warning(error.response.data.message, {
          position: toast.POSITION.TOP_LEFT,
          toastId: "axios-get-all-questions-error",
        });
      } else if (error.request) {
        toast.error("Network error. Please check your connection.", {
          position: toast.POSITION.TOP_LEFT,
          toastId: "network",
        });
      }
    } else {
      toast.error("An error occurred. Please try again.", {
        position: toast.POSITION.TOP_LEFT,
        toastId: "get-all-questions-error",
      });
    }
  }
};

export const addNewSkill = async (data: { name: string }) => {
  try {
    const response: AxiosResponse = await api.post("/admin_add_skill", data);
    const message = response.data.message;
    toast.success(message, {
      position: toast.POSITION.TOP_LEFT,
    });
    return { success: true, message };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const message = error.response.data.message;
        toast.error(message, {
          position: toast.POSITION.TOP_LEFT,
          toastId: "axios-add-new-skill-error",
        });
        return { success: false, message };
      } else if (error.request) {
        toast.error("Network error. Please check your connection.", {
          position: toast.POSITION.TOP_LEFT,
          toastId: "network",
        });
        return { success: false, message: "network_error" };
      }
    } else {
      console.error("Non-Axios error:", error);
      return { success: false, message: "error" };
    }
  }
};

export const addQuestions = async (data: IQuestion) => {
  try {
    const response: AxiosResponse = await api.post("/admin_add_question", data);
    const message = response.data.message;
    toast.success(message, {
      position: toast.POSITION.TOP_LEFT,
    });
    return { success: true, message };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const message = error.response.data.message;
        toast.error(message, {
          position: toast.POSITION.TOP_LEFT,
          toastId: "axios-add-questions-error",
        });
        return { success: false, message };
      } else if (error.request) {
        toast.error("Network error. Please check your connection.", {
          position: toast.POSITION.TOP_LEFT,
          toastId: "network",
        });
        return { success: false, message: "network_error" };
      }
    } else {
      console.error("Non-Axios error:", error);
      return { success: false, message: "error" };
    }
  }
};

export const editQuestions = async (data: IEditQuestion) => {
  try {
    const response: AxiosResponse = await api.post(
      "/admin_edit_question",
      data
    );
    const message = response.data.message;
    toast.success(message, {
      position: toast.POSITION.TOP_LEFT,
    });
    return { success: true, message };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const message = error.response.data.message;
        toast.error(message, {
          position: toast.POSITION.TOP_LEFT,
          toastId: "axios-edit-questions-error",
        });
        return { success: false, message };
      } else if (error.request) {
        toast.error("Network error. Please check your connection.", {
          position: toast.POSITION.TOP_LEFT,
          toastId: "network",
        });
        return { success: false, message: "network_error" };
      }
    } else {
      console.error("Non-Axios error:", error);
      return { success: false, message: "error" };
    }
  }
};

export const updateProfile = async (data: FormData) => {
  try {
    const response: AxiosResponse = await api.post("/update_profile", data);
    const message = response.data.message;
    toast.success(message, {
      position: toast.POSITION.TOP_LEFT,
    });
    return { success: true, message };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const message = error.response.data.message;
        toast.error(message, {
          position: toast.POSITION.TOP_LEFT,
          toastId: "axios-update-profile-error",
        });
        return { success: false };
      } else if (error.request) {
        toast.error("Network error. Please check your connection.", {
          position: toast.POSITION.TOP_LEFT,
          toastId: "axios-update-profile-error",
        });
        return { success: false };
      }
    } else {
      console.error("Non-Axios error:", error);
      return { success: false };
    }
  }
};

export const deleteQuestions = async (data: { questionId: string }) => {
  try {
    const response: AxiosResponse = await api.post(
      "/admin_delete_question",
      data
    );
    const message = response.data.message;
    toast.success(message, {
      position: toast.POSITION.TOP_LEFT,
    });
    return { success: true, message };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.log(error.response);
        const message = error.response.data.message;
        toast.error(message, {
          position: toast.POSITION.TOP_LEFT,
          toastId: "axios-delete-question-error",
        });
        return { success: false, message };
      } else if (error.request) {
        toast.error("Network error. Please check your connection.", {
          position: toast.POSITION.TOP_LEFT,
          toastId: "network",
        });
        return { success: false, message: "network_error" };
      }
    } else {
      console.error("Non-Axios error:", error);
      return { success: false, message: "error" };
    }
  }
};

export const getTotalJobs = async () => {
  try {
    const response: AxiosResponse = await api.get("admin_get_total_job");
    const message = response.data.message;
    toast.success(message, {
      position: toast.POSITION.TOP_LEFT,
    });
    return { success: true, response: response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.log(error.response);
        const message = error.response.data.message;
        toast.error(message, {
          position: toast.POSITION.TOP_LEFT,
          toastId: "axios-get-total-jobs-error",
        });
        return { success: false, message };
      } else if (error.request) {
        toast.error("Network error. Please check your connection.", {
          position: toast.POSITION.TOP_LEFT,
          toastId: "network",
        });
        return { success: false, message: "network_error" };
      }
    } else {
      console.error("Non-Axios error:", error);
      return { success: false, message: "error" };
    }
  }
};

export const getJobs = async (data: IGetJobsData) => {
  try {
    const response: AxiosResponse = await api.get("/admin_get_jobs_detail", {
      params: data,
    });
    const message = response.data.message;
    toast.success(message, {
      position: toast.POSITION.TOP_LEFT,
    });
    return { success: true, response: response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.log(error.response);
        const message = error.response.data.message;
        toast.error(message, {
          position: toast.POSITION.TOP_LEFT,
          toastId: "axios-get-jobs-error",
        });
        return { success: false, message };
      } else if (error.request) {
        toast.error("Network error. Please check your connection.", {
          position: toast.POSITION.TOP_LEFT,
          toastId: "network",
        });
        return { success: false, message: "network_error" };
      }
    } else {
      console.error("Non-Axios error:", error);
      return { success: false, message: "error" };
    }
  }
};

export const getRevenueAnalysis = async (data: IGetRevenueAnalysisParams) => {
  try {
    const response: AxiosResponse = await api.get("get_revenue_par_day", {
      params: data,
    });
    const message = response.data.message;
    toast.success(message, {
      position: toast.POSITION.TOP_LEFT,
    });
    return { success: true, response: response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.log(error.response);
        const message = error.response.data.message;
        toast.error("Analysis for date not found", {
          position: toast.POSITION.TOP_LEFT,
          toastId: "axios-get-revenue-error",
        });
        return { success: false, message };
      } else if (error.request) {
        toast.error("Network error. Please check your connection.", {
          position: toast.POSITION.TOP_LEFT,
          toastId: "network",
        });
        return { success: false, message: "network_error" };
      }
    } else {
      console.error("Non-Axios error:", error);
      return { success: false, message: "error" };
    }
  }
};
