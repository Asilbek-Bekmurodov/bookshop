import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${BASE}/auth/login`, credentials, { withCredentials: true });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Xato yuz berdi');
  }
});

export const registerUser = createAsyncThunk('auth/register', async (form, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${BASE}/auth/register`, form, { withCredentials: true });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Xato yuz berdi');
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await axios.post(`${BASE}/auth/logout`, {}, { withCredentials: true }).catch(() => {});
});

export const refreshAuth = createAsyncThunk('auth/refresh', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${BASE}/auth/refresh`, {}, { withCredentials: true });
    return data;
  } catch (err) {
    return rejectWithValue(null);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, accessToken: null, loading: false, error: null, initialized: false },
  reducers: {
    setTokens(state, { payload }) {
      state.accessToken = payload.accessToken;
      state.user = payload.user;
    },
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const pending = (state) => { state.loading = true; state.error = null; };
    const fulfilled = (state, { payload }) => {
      state.loading = false;
      state.user = payload.user;
      state.accessToken = payload.accessToken;
    };
    const rejected = (state, { payload }) => { state.loading = false; state.error = payload; };

    builder
      .addCase(loginUser.pending, pending)
      .addCase(loginUser.fulfilled, fulfilled)
      .addCase(loginUser.rejected, rejected)
      .addCase(registerUser.pending, pending)
      .addCase(registerUser.fulfilled, fulfilled)
      .addCase(registerUser.rejected, rejected)
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
      })
      .addCase(refreshAuth.fulfilled, (state, { payload }) => {
        state.user = payload.user;
        state.accessToken = payload.accessToken;
        state.initialized = true;
      })
      .addCase(refreshAuth.rejected, (state) => {
        state.initialized = true;
      });
  },
});

export const { setTokens, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
