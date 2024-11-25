// src/features/paymentUrlSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  paymentUrl: "", // Lưu địa chỉ URL thanh toán
};

const paymentUrlSlice = createSlice({
  name: "paymentUrl",
  initialState,
  reducers: {
    setPaymentUrl: (state, action) => {
      state.paymentUrl = action.payload;
    },
    clearPaymentUrl: (state) => {
      state.paymentUrl = "";
    },
  },
});

// Export actions và reducer
export const { setPaymentUrl, clearPaymentUrl } = paymentUrlSlice.actions;
export default paymentUrlSlice.reducer;
