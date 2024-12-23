import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface SelectedOption {
  name: string;
  price: number;
  optionSelectionId: string;
}

export interface CartItem {
  quantity: number;
  dishId: string;
  detail: {
    dishName: string;
    price: number;
    thumbImage: string;
  };
  selectedOptions: {
    [groupId: string]: {
      optionSelectionId: string;
      name: string;
      price: number;
    };
  };
  availableQuantity: number;
}

export interface OrderState {
  carts: CartItem[] | [];
  status: "success" | "error" | null;
  error: string | null;
}

const initialState: OrderState = {
  carts: [],
  status: null,
  error: null,
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    doAddProductAction: (state, action: PayloadAction<CartItem>) => {
      const item = action.payload;

      const totalQuantity = state.carts.reduce((total, cartItem) => {
        if (cartItem.dishId === item.dishId) {
          return Number(total) + Number(cartItem.quantity);
        }
        return total;
      }, 0);

      if (
        Number(totalQuantity) + Number(item.quantity) >
        Number(item.availableQuantity)
      ) {
        state.status = "error";
        state.error = `Total number of products in cart (${totalQuantity}) and the quantity you want to add (${item.quantity}) exceed the available quantity (${item.availableQuantity}).`;
        return;
      }

      const existingItemIndex = state.carts.findIndex(
        (c) =>
          c.dishId === item.dishId &&
          JSON.stringify(c.selectedOptions) ===
            JSON.stringify(item.selectedOptions)
      );

      if (existingItemIndex > -1) {
        state.carts[existingItemIndex].quantity =
          Number(state.carts[existingItemIndex].quantity) +
          Number(item.quantity);
      } else {
        state.carts.push(item);
      }

      state.status = "success";
      state.error = null;
    },

    doRemoveProductAction: (
      state,
      action: PayloadAction<{
        dishId: string;
        selectedOptions: CartItem["selectedOptions"];
      }>
    ) => {
      const { dishId, selectedOptions } = action.payload;
      state.carts = state.carts.filter(
        (item) =>
          !(
            item.dishId === dishId &&
            JSON.stringify(item.selectedOptions) ===
              JSON.stringify(selectedOptions)
          )
      );
    },

    doUpdateQuantityAction: (
      state,
      action: PayloadAction<{
        dishId: string;
        selectedOptions: CartItem["selectedOptions"];
        quantity: number;
      }>
    ) => {
      const { dishId, selectedOptions, quantity } = action.payload;
      const itemIndex = state.carts.findIndex(
        (item) =>
          item.dishId === dishId &&
          JSON.stringify(item.selectedOptions) ===
            JSON.stringify(selectedOptions)
      );

      if (itemIndex !== -1) {
        const item = state.carts[itemIndex];
        if (quantity <= item.availableQuantity) {
          if (quantity > 0) {
            state.carts[itemIndex].quantity = quantity;
            state.status = "success";
            state.error = null;
          } else {
            state.carts.splice(itemIndex, 1);
            state.status = "success";
            state.error = null;
          }
        } else {
          state.status = "error";
          state.error = `Cannot update quantity. The maximum available quantity is ${item.availableQuantity}`;
        }
      }
    },

    doClearCartAction: (state) => {
      state.carts = [];
      state.status = null;
      state.error = null;
    },

    resetStatus: (state) => {
      state.status = null;
      state.error = null;
    },
  },
});

export const {
  doAddProductAction,
  doRemoveProductAction,
  doUpdateQuantityAction,
  doClearCartAction,
  resetStatus,
} = orderSlice.actions;

export default orderSlice.reducer;
