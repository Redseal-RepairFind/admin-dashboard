import { IAdminData } from "@/lib/types";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface IState {
  isLoggedIn: boolean;
  signUpMail: string;
  adminData: IAdminData;
}

const initialState: IState = {
  isLoggedIn: true,
  signUpMail: "",
  adminData: {
    firstName: "",
    lastName: "",
    image: "",
    isSuperAdmin: false,
  },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
    setSignUpMail: (state, action: PayloadAction<string>) => {
      state.signUpMail = action.payload;
    },

    setAdminData: (state, action: PayloadAction<IAdminData>) => {
      state.adminData = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setIsLoggedIn, setSignUpMail, setAdminData } = authSlice.actions;

export default authSlice.reducer;
