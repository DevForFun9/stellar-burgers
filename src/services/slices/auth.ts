import {
  TRegisterData,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi
} from '@api';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';

type TAuthStore = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  loginError?: string | null;
};

const initialState: TAuthStore = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  loginError: null
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  selectors: {
    selectUser: (state) => state.user,
    selectIsAuthorized: (state) => !!state.user,
    selectUserIsLoading: (state) => state.isLoading,
    selectUserError: (state) => state.loginError,
    selectIsAuthChecked: (state) => state.isAuthChecked
  },
  reducers: {
    setAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    },
    setUser: (state, action: PayloadAction<TUser | null>) => {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.loginError = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.loginError = action.error.message;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.isAuthChecked = true;
        state.loginError = null;
      })
      .addCase(logoutUser.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.loginError = action.error.message;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.loginError = null;
        state.user = null;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(checkUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(checkUser.rejected, (state) => {
        state.isLoading = false;
      });
  }
});

export const checkUser = createAsyncThunk(
  'auth/checkUserAuth',
  async (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      getUserApi()
        .then((res) => dispatch(authSlice.actions.setUser(res.user)))
        .catch((error) => {
          deleteCookie('accessToken');
          localStorage.removeItem('refreshToken');
          throw error;
        })
        .finally(() => dispatch(authSlice.actions.setAuthChecked(true)));
    } else {
      dispatch(authSlice.actions.setAuthChecked(true));
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }: TRegisterData) => {
    const res = await registerUserApi({ name, email, password });
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: Omit<TRegisterData, 'name'>) => {
    const res = await loginUserApi({ email, password });
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (data: TRegisterData) => {
    const res = await updateUserApi(data);
    return res.user;
  }
);

export const {
  selectUser,
  selectIsAuthorized,
  selectUserIsLoading,
  selectIsAuthChecked
} = authSlice.selectors;
export default authSlice.reducer;
