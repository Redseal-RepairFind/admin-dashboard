import { ITransactionsDetail } from "@/lib/types";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface IState {
  value: ITransactionsDetail;
}

const initialState: IState = {
  value: {
    contractor: {
      _id: "",
      firstName: "",
      lastName: "",
      email: "",
      status: "",
      profileImage: "",
    },

    contractorDocument: {
      phoneNumber: "",
      skill: "",
    },
    customer: {
      fullName: "",
      profileImg: "",
      phoneNumber: "",
      email: "",
    },
    transaction: {
      _id: "",
      type: "",
      amount: 0,
      initiator: "",
      from: "",
      to: "",
      fromId: "",
      invoiceId: "",
      toId: "",
      description: "",
      status: "",
      createdAt: "",
    },
    to: "",
    from: {
      _id: "",
      email: "",
      fullName: "",
      phoneNumber: "",
      createdAt: "",
      location: "",
      profileImg: "",
    },
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

export const singleTranactionSlice = createSlice({
  name: "singleTranaction",
  initialState,
  reducers: {
    setSingleTranactionsDetail: (
      state,
      action: PayloadAction<ITransactionsDetail>
    ) => {
      console.log(action.payload);
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setSingleTranactionsDetail } = singleTranactionSlice.actions;

export default singleTranactionSlice.reducer;
