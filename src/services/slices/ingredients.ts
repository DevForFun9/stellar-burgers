import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RequestStatus, TIngredient } from '@utils-types';

type TIngredientsState = {
  ingredients: TIngredient[];
  status: RequestStatus;
};

const initialState: TIngredientsState = {
  ingredients: [],
  status: RequestStatus.Idle
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  selectors: {
    selectIngredients: (state: TIngredientsState) => state.ingredients,
    selectIngredientsStatus: (state: TIngredientsState) => state.status,
    selectBun: (state: TIngredientsState) =>
      state.ingredients.filter((i) => i.type === 'bun'),
    selectMains: (state: TIngredientsState) =>
      state.ingredients.filter((i) => i.type === 'main'),
    selectSauces: (state: TIngredientsState) =>
      state.ingredients.filter((i) => i.type === 'sauce'),
    selectIngredientsById: (state: TIngredientsState, id: string | undefined) =>
      state.ingredients.find((i) => i._id === id)
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.status = RequestStatus.Loading;
      })
      .addCase(getIngredients.rejected, (state) => {
        state.status = RequestStatus.Fail;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.status = RequestStatus.Success;
        state.ingredients = action.payload;
      });
  }
});

export const getIngredients = createAsyncThunk(
  'ingredients/getIngredients',
  getIngredientsApi
);

export const {
  selectIngredients,
  selectIngredientsStatus,
  selectBun,
  selectMains,
  selectSauces,
  selectIngredientsById
} = ingredientsSlice.selectors;
export default ingredientsSlice.reducer;
