import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Service } from "@repo/types";
import { servicesAPI } from "@/lib/api";

export interface ServiceState {
  services: Service[];
  selectedService: Service | null;
  loading: boolean;
  error: string | null;
}

const initialState: ServiceState = {
  services: [],
  selectedService: null,
  loading: false,
  error: null,
};

export const fetchServices = createAsyncThunk(
  "services/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await servicesAPI.getAll();
      return res.services;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : "Failed to fetch services");
    }
  }
);

export const fetchServiceById = createAsyncThunk(
  "services/fetchById",
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await servicesAPI.getById(id);
      return res.service;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : "Failed to fetch service");
    }
  }
);

const serviceSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    clearSelectedService(state) {
      state.selectedService = null;
    },
    clearServiceError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchServiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedService = action.payload;
      })
      .addCase(fetchServiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedService, clearServiceError } = serviceSlice.actions;
export default serviceSlice.reducer;
