import { apiRequest } from "@/utils/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const getOrGenerateGuestId = () => {
  if (typeof window === "undefined") return "";
  let gid = localStorage.getItem("praya_guestId");
  if (!gid) {
    gid = `g-${Math.random().toString(36).substr(2, 9)}${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("praya_guestId", gid);
  }
  return gid;
};

export const initializeAuth = createAsyncThunk(
  "auth/initialize",
  async (_, { dispatch }) => {
    if (typeof window === "undefined")
      return { token: null, user: null, guestId: "" };
    const token = localStorage.getItem("praya_token");
    const userStr = localStorage.getItem("praya_user");
    const guestId = getOrGenerateGuestId();
    const user = userStr ? JSON.parse(userStr) : null;

    return { token, user, guestId };
  },
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await apiRequest("/api/user/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (data?.data?.token) {
        localStorage.setItem("praya_token", data.data.token);
        const userObj = data.data.user || {
          name: data.data.name || "User",
          email,
        };
        localStorage.setItem("praya_user", JSON.stringify(userObj));
        return { token: data.data.token, user: userObj };
      }
      return rejectWithValue("Invalid credentials");
    } catch (err) {
      return rejectWithValue(err.message || "Connection error");
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ name, email, phone, password }, { rejectWithValue }) => {
    try {
      const data = await apiRequest("/api/user", {
        method: "POST",
        body: JSON.stringify({ name, email, phone, password }),
      });
      if (data?.data?.token) {
        localStorage.setItem("praya_token", data.data.token);
        const userObj = data.data.user || {
          name: data.data.name || "User",
          email,
        };
        localStorage.setItem("praya_user", JSON.stringify(userObj));
        return { token: data.data.token, user: userObj };
      }
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Registration failed");
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    user: null,
    guestId: "",
    loading: false,
    error: null,
    successMessage: null,
    authModalOpen: false,
  },
  reducers: {
    openModal(state) {
      state.authModalOpen = true;
    },
    closeModal(state) {
      state.authModalOpen = false;
    },
    logoutUser(state) {
      state.token = null;
      state.user = null;
      state.error = null;
      state.successMessage = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("praya_token");
        localStorage.removeItem("praya_user");
      }
    },
    clearAuthMessages(state) {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.guestId = action.payload.guestId;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.successMessage = "Vault access granted. Welcome.";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.successMessage = "Vault access granted. Welcome.";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      });
  },
});

export const { logoutUser, clearAuthMessages, openModal, closeModal } =
  authSlice.actions;
export default authSlice.reducer;
