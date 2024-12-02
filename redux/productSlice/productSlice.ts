import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Dish {
  dishId: string;
  dishName: string;
  slug: string;
  thumbnail: string;
  price: number;
  offerPrice: number;
  categoryNames: string;
}

// Trạng thái ban đầu
const initialState: Dish[] = [];

const dishSlice = createSlice({
  name: "dishes",
  initialState,
  reducers: {
    // Thêm một món ăn
    addDish: (state, action: PayloadAction<Dish[]>) => {
      return action.payload;
    },
    clearDishes: (state) => {
      return [];
    },
  },
});

export const { addDish, clearDishes } = dishSlice.actions;
export default dishSlice.reducer;
