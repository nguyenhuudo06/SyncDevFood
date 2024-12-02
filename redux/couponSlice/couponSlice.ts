import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  couponCode: "",
  couponId: "",
  discountPercent: 0,
  maxDiscount: 0,
  minOrderValue: 0,
};

const couponSlice = createSlice({
  name: "coupon",
  initialState,
  reducers: {
    setCoupon: (state, action) => {
      const {
        couponCode,
        couponId,
        discountPercent,
        maxDiscount,
        minOrderValue,
      } = action.payload;
      state.couponCode = couponCode || "";
      state.couponId = couponId || "";
      state.discountPercent = discountPercent || 0;
      state.maxDiscount = maxDiscount || 0;
      state.minOrderValue = minOrderValue || 0;
    },
    resetCoupon: () => initialState,
  },
});

export const { setCoupon, resetCoupon } = couponSlice.actions;

export default couponSlice.reducer;
