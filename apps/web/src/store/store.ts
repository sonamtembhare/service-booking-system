import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import serviceReducer from "./slices/serviceSlice";
import bookingReducer from "./slices/bookingSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      services: serviceReducer,
      bookings: bookingReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
