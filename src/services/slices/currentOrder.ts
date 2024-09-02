import { getOrderByNumberApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RequestStatus, TOrder } from '@utils-types';

type TCurrentOrderState = {
  order: TOrder | null;
  status: RequestStatus;
};

const initialState: TCurrentOrderState = {
  order: null,
  status: RequestStatus.Idle
};

export const currentOrderSlice = createSlice({
  name: 'currentOrder',
  initialState,
  selectors: {
    selectCurrentOrder: (state: TCurrentOrderState) => state.order,
    selectCurrentOrderLoading: (state: TCurrentOrderState) =>
      state.status === RequestStatus.Loading
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentOrder.pending, (state) => {
        state.status = RequestStatus.Loading;
      })
      .addCase(getCurrentOrder.rejected, (state) => {
        state.status = RequestStatus.Fail;
      })
      .addCase(getCurrentOrder.fulfilled, (state, action) => {
        state.status = RequestStatus.Success;
        state.order = action.payload.orders[0];
      });
  }
});

export const { selectCurrentOrder, selectCurrentOrderLoading } =
  currentOrderSlice.selectors;

export const getCurrentOrder = createAsyncThunk(
  'currentOrder/getCurrentOrder',
  (number: number) => getOrderByNumberApi(number)
);

export default currentOrderSlice.reducer;
