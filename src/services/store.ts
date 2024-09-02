import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import authSliceReducer from './slices/auth';
import burgerConstructorSliceReducer from './slices/burger-constructor';
import burgerOrderSliceReducer from './slices/burger-order';
import currentOrderSliceReducer from './slices/currentOrder';
import feedsSliceReducer from './slices/feed';
import ingredientsSliceReducer from './slices/ingredients';
import orderSliceReducer from './slices/orders';

const rootReducer = combineReducers({
  auth: authSliceReducer,
  ingredients: ingredientsSliceReducer,
  orders: orderSliceReducer,
  feed: feedsSliceReducer,
  burgerConstructor: burgerConstructorSliceReducer,
  burgerOrder: burgerOrderSliceReducer,
  currentOrder: currentOrderSliceReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
