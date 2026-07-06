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
    const baseUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
    try {
      const res = await fetch(`${baseUrl}/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      console.log("data :>> ", data);
      if (data.success && data?.data?.token) {
        localStorage.setItem("praya_token", data.data.token);
        const userObj = data.data.user || {
          name: data.data.name || "User",
          email,
        };
        localStorage.setItem("praya_user", JSON.stringify(userObj));
        return { token: data?.data?.token, user: userObj };
      }
      return rejectWithValue(data.message || "Invalid credentials");
    } catch (err) {
      return rejectWithValue("Connection error");
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ name, email, phone, password }, { rejectWithValue }) => {
    const baseUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
    try {
      const res = await fetch(`${baseUrl}/api/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });
      const data = await res.json();
      if (data.success) return data;
      return rejectWithValue(data.message || "Registration failed");
    } catch (err) {
      return rejectWithValue("Connection error");
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
  },
  reducers: {
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
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.successMessage =
          "Profile registered successfully. Please sign in.";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      });
  },
});

export const { logoutUser, clearAuthMessages } = authSlice.actions;
export default authSlice.reducer;
