// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   isAuthenticated: !!localStorage.getItem("accessToken"),
//   user: null,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     login(state, action) {
//       state.isAuthenticated = true;
//       state.user = action.payload;
//     },
//     logout(state) {
//       state.isAuthenticated = false;
//       state.user = null;
//       localStorage.removeItem("accessToken");
//       document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//     },
//   },
// });

// export const { login, logout } = authSlice.actions;
// export default authSlice.reducer;


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Add a new async thunk to check authentication status
export const checkAuthStatus = createAsyncThunk(
  "auth/checkStatus",
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      
      if (!accessToken) {
        return rejectWithValue("No access token found");
      }
      
      const response = await axios.get(
        "https://partydecorhub.com/api/check-auth",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
      
      return response.data;
    } catch (error) {
      // If token is invalid or expired, clean up localStorage
      localStorage.removeItem("accessToken");
      return rejectWithValue(error.response?.data || "Authentication failed");
    }
  }
);

const initialState = {
  isAuthenticated: !!localStorage.getItem("accessToken"),
  user: null,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.status = "succeeded";
      state.error = null;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.status = "idle";
      state.error = null;
      localStorage.removeItem("accessToken");
      document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuthStatus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.user = null;
        state.status = "failed";
        state.error = action.payload;
        localStorage.removeItem("accessToken");
      });
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;