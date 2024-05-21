import { ICustomerData, IJobHistory } from "@/lib/types";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface IState {
  value: ICustomerData;
  history: IJobHistory;
}

const initialState: IState = {
  value: {
    customer: {
      _id: "",
      email: "",
      fullName: "",
      phoneNumber: "",
      createdAt: "",
      updatedAt: "",
      profileImg: "",
      __v: 0,
    },
    jobHistory: [],
    rating: null,
  },
  history: {
    job: {
      inspection: {
        status: false,
        confirmPayment: false,
      },
      _id: "",
      address: "",
      status: "",
      description: "",
      jobTitle: "",
      postalCode: "",
      totalAmountContractorWithdraw: "",
      totalAmountCustomerToPaid: "",
      totalQuatation: "",
      time: "",
      gst: "",

      quate: [],
      createdAt: "",
    },
  },
};

export const singleCustomerSlice = createSlice({
  name: "singleCustomer",
  initialState,
  reducers: {
    setSingleCustomersDetail: (state, action: PayloadAction<ICustomerData>) => {
      console.log(action.payload);
      state.value = action.payload;
    },
    setSingleCustomersJob: (state, action: PayloadAction<IJobHistory>) => {
      console.log(action.payload);
      state.history = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setSingleCustomersDetail, setSingleCustomersJob } =
  singleCustomerSlice.actions;

export default singleCustomerSlice.reducer;
