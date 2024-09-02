import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';

type TBurgerConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TBurgerConstructorState = {
  bun: null,
  ingredients: []
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addToConstructor: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: crypto.randomUUID() }
      })
    },
    removeFromConstructor: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id != action.payload
      );
    },
    resetConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
    moveItemUp: (state, action: PayloadAction<number>) => {
      const item = state.ingredients.splice(action.payload, 1)[0];
      state.ingredients.splice(action.payload - 1, 0, item);
    },
    moveItemDown: (state, action: PayloadAction<number>) => {
      const item = state.ingredients.splice(action.payload, 1)[0];
      state.ingredients.splice(action.payload + 1, 0, item);
    }
  },
  selectors: {
    selectBurger: (state: TBurgerConstructorState) => state
  }
});

export const { selectBurger } = burgerConstructorSlice.selectors;
export const {
  addToConstructor,
  removeFromConstructor,
  resetConstructor,
  moveItemUp,
  moveItemDown
} = burgerConstructorSlice.actions;
export default burgerConstructorSlice.reducer;
