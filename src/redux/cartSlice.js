import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  cartCount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, quantity } = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cartItems.push({ ...action.payload });
      }
      state.cartCount += quantity; 
    },
    removeFromCart: (state, action) => {
      const itemIndex = state.cartItems.findIndex(
        (item) => item.id === action.payload.id
      );
      if (itemIndex !== -1) {
        state.cartCount -= state.cartItems[itemIndex].quantity; 
        state.cartItems.splice(itemIndex, 1);
      }
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const itemIndex = state.cartItems.findIndex((item) => item.id === id);
      if (itemIndex !== -1) {
        // Calculate the difference between new and old quantity
        const oldQuantity = state.cartItems[itemIndex].quantity;
        const quantityDifference = quantity - oldQuantity;
        
        // Update the item quantity
        state.cartItems[itemIndex].quantity = quantity;
        
        // Update the total cart count
        state.cartCount += quantityDifference;
      }
    },
    mergeCart: (state, action) => {
      state.cartItems = action.payload; 
      state.cartCount = action.payload.reduce(
        (count, item) => count + item.quantity,
        0
      );
    }
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  mergeCart,
} = cartSlice.actions;
export default cartSlice.reducer;