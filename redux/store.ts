import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice/authSlice";
import orderSlice from "./orderSlice/orderSlice";
import paymentUrlReducer from "./paymentUrlSlice/paymentUrlSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    order: orderSlice,
    paymentUrl: paymentUrlReducer,
  },
});

// Định nghĩa kiểu RootState và AppDispatch để sử dụng trong TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
