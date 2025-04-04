import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { User } from '@/types/todo';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
  isLoggedIn: false,
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        toast.error('Login failed')
        throw new Error('Login failed');
      }
      
      const data = await response.json();
      if (!data.token){
        toast.error(data.message);
      } else {
        localStorage.setItem('token', data.token);
        return data;
      }
      
    } catch (error) {
      toast.error('Login failed')
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ email, password, username }: { email: string; password: string; username: string }) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username }),
      });
      
      if (!response.ok) {
        toast.error('Registration failed')
        throw new Error('Registration failed');
      }
      const data = await response.json();
      
      if (!data.user){
        toast.error(data.message);
      }
      else {
        toast.error("Registered successfully.");
        localStorage.setItem('token', data.token);
        return data;
      }
    } catch (error) {
      toast.error('Registration failed')
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      state.isLoggedIn = false
    },
    check: (state, action) => {
      state.isLoggedIn = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLoggedIn = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLoggedIn = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
      });
  },
});

export const { logout, check} = authSlice.actions;
export default authSlice.reducer;