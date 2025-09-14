import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface IDetails {
  totalCustomer: number;
  totalContractor: number;
  totalRevenue: number;
  totalJob: number;
  totalPendingJob: number;
  totalCompletedJob: number;
  totalComplainedJob: number;
  totalProgressJob: number;
}
export interface IState {
  details: IDetails;
}

const initialState: IState = {
  details: {
    totalCustomer: 0,
    totalContractor: 0,
    totalRevenue: 0,
    totalJob: 0,
    totalPendingJob: 0,
    totalCompletedJob: 0,
    totalComplainedJob: 0,
    totalProgressJob: 0,
  },
};

export const totalSlice = createSlice({
  name: "total",
  initialState,
  reducers: {
    setOverviewDetails: (state, action: PayloadAction<IDetails>) => {
      state.details = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setOverviewDetails } = totalSlice.actions;

export default totalSlice.reducer;
