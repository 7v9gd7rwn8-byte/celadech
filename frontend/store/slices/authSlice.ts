import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

// Load from localStorage on initialization
if (typeof window !== 'undefined') {
  const savedToken = localStorage.getItem('authToken');
  const savedUser = localStorage.getItem('authUser');
  if (savedToken && savedUser) {
    initialState.token = savedToken;
    initialState.user = JSON.parse(savedUser);
    initialState.isAuthenticated = true;
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('authToken', action.payload.token);
      localStorage.setItem('authUser', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
