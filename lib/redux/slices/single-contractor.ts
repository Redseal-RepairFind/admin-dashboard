import { IContractorsDetails, IJobHistory } from "@/lib/types";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface IState {
  value: IContractorsDetails;
  history: IJobHistory;
}

const initialState: IState = {
  value: {
    rating: null,
    availability: "",
    contractorProfile: {
      _id: "",
      email: "",
      firstName: "",
      dateOfBirth: "",
      lastName: "",
      createdAt: "",
      updatedAt: "",
      __v: 0,
      location: "",
      profileImage: "",
      documentVerification: false,
      status: "",
    },
    document: {
      skill: "",
      phoneNumber: "",
      businessName: "",
      tradeTicket: "",
      postalCode: "",
      city: "",
      website: "",
      yearExpirence: "",
    },
    jobHistory: [],
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

export const singleContractorSlice = createSlice({
  name: "singleContractor",
  initialState,
  reducers: {
    setsingleContractorsDetail: (
      state,
      action: PayloadAction<IContractorsDetails>
    ) => {
      console.log(action.payload);
      state.value = action.payload;
    },
    setSingleContractorsJob: (state, action: PayloadAction<IJobHistory>) => {
      console.log(action.payload);
      state.history = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setsingleContractorsDetail, setSingleContractorsJob } =
  singleContractorSlice.actions;

export default singleContractorSlice.reducer;
