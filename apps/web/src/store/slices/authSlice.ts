import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { User } from "@repo/types";
import { authAPI } from "@/lib/api";
import { setToken, setUser, getToken, getUser, logout as authLogout } from "@/lib/auth";

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await authAPI.login(credentials);
      setToken(res.token);
      setUser(res.user);
      return res;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : "Login failed");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (data: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await authAPI.register(data);
      return res;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : "Registration failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    logout(state) {
      authLogout();
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    loadUser(state) {
      const user = getUser();
      const token = getToken();
      state.user = user;
      state.token = token;
      state.isAuthenticated = !!token;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, logout, loadUser } = authSlice.actions;
export default authSlice.reducer;
