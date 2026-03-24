import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 1. Action pour la connexion
export const loginUser = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post("http://localhost:8000/api/login", credentials);
    return response.data; // Doit contenir { user: {...}, token: "..." }
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});
export const getProfile = createAsyncThunk("auth/getProfile", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("/api/user"); // Route Laravel standard (auth:sanctum)
    return response.data; 
  } catch (err) {
    // Si le token est expiré ou invalide, on le supprime
    localStorage.removeItem('token');
    return rejectWithValue(err.response.data);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token") || null,
    isLoggedIn: !!localStorage.getItem("token"),
    loading: false,
    error: null,
  },
  reducers: {
    // Action pour la déconnexion immédiate
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // --- LOGIN ---
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.user = action.payload.user; // Mise à jour immédiate du profil
        state.token = action.payload.token;
        
        // CRITIQUE : On stocke le token pour le prochain refresh
        localStorage.setItem("token", action.payload.token);
        
        // Configuration globale d'Axios pour les prochaines requêtes
        axios.defaults.headers.common["Authorization"] = `Bearer ${action.payload.token}`;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
  state.isLoggedIn = true;
  state.user = action.payload; // L'icône de profil apparaîtra ici !
})
.addCase(getProfile.rejected, (state) => {
  state.isLoggedIn = false;
  state.user = null;
})
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
      
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;