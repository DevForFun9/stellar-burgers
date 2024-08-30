import { orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RequestStatus, TOrder } from '@utils-types';

type TBurgerOrderState = {
  order: TOrder | null;
  status: RequestStatus;
};

const initialState: TBurgerOrderState = {
  order: null,
  status: RequestStatus.Idle
};

export const burgerOrderSlice = createSlice({
  name: 'burgerOrder',
  initialState,
  reducers: {
    resetOrder: (state) => {
      state.order = null;
      state.status = RequestStatus.Idle;
    }
  },
  selectors: {
    selectBurgerOrder: (state) => state.order,
    selectBurgerOrderStatus: (state) => state.status
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.status = RequestStatus.Loading;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.status = RequestStatus.Success;
        state.order = action.payload.order;
      })
      .addCase(orderBurger.rejected, (state) => {
        state.status = RequestStatus.Fail;
      });
  }
});

export const orderBurger = createAsyncThunk(
  'burgerOrder/orderBurger',
  async (data: string[]) => await orderBurgerApi(data)
);

export const { selectBurgerOrder, selectBurgerOrderStatus } =
  burgerOrderSlice.selectors;
export const { resetOrder } = burgerOrderSlice.actions;
export default burgerOrderSlice.reducer;
