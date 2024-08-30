import { getOrdersApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RequestStatus, TOrder } from '@utils-types';

type TOrdersState = {
  orders: TOrder[];
  status: RequestStatus;
};

const initialState: TOrdersState = {
  orders: [],
  status: RequestStatus.Idle
};

export const orderSlice = createSlice({
  name: 'orders',
  initialState,
  selectors: {
    selectOrders: (state: TOrdersState) => state.orders,
    selectOrdersByNumber: (state: TOrdersState, number: string | undefined) =>
      state.orders.find((item) => item.number.toString() === number)
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.status = RequestStatus.Loading;
      })
      .addCase(getOrders.rejected, (state) => {
        state.status = RequestStatus.Fail;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.status = RequestStatus.Success;
        state.orders = action.payload;
      });
  }
});

export const getOrders = createAsyncThunk('orders/getOrders', getOrdersApi);

export const { selectOrders, selectOrdersByNumber } = orderSlice.selectors;
export default orderSlice.reducer;
