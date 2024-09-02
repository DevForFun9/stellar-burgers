import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RequestStatus, TOrder } from '@utils-types';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  status: RequestStatus;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  status: RequestStatus.Idle
};

export const feedsSlice = createSlice({
  name: 'feed',
  initialState,
  selectors: {
    selectFeed: (state: TFeedState) => state,
    selectFeedOrders: (state: TFeedState) => state.orders,
    selectFeedTotal: (state: TFeedState) => state.total,
    selectFeedTotalToday: (state: TFeedState) => state.totalToday,
    selectFeedLoading: (state: TFeedState) =>
      state.status === RequestStatus.Loading
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeed.pending, (state) => {
        state.status = RequestStatus.Loading;
      })
      .addCase(getFeed.rejected, (state) => {
        state.status = RequestStatus.Fail;
      })
      .addCase(getFeed.fulfilled, (state, action) => {
        state.status = RequestStatus.Success;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      });
  }
});

export const getFeed = createAsyncThunk('feed/getFeed', getFeedsApi);

export const {
  selectFeedOrders,
  selectFeedTotal,
  selectFeedTotalToday,
  selectFeed,
  selectFeedLoading
} = feedsSlice.selectors;
export default feedsSlice.reducer;
