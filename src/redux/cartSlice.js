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
            const existingItem = state.cartItems.find(item => item.id === id);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                state.cartItems.push({ ...action.payload });
            }
            state.cartCount += quantity; // Update cart count based on selected quantity
        },
        removeFromCart: (state, action) => {
            const itemIndex = state.cartItems.findIndex(item => item.id === action.payload.id);
            if (itemIndex !== -1) {
                state.cartCount -= state.cartItems[itemIndex].quantity;
                state.cartItems.splice(itemIndex, 1);
            }
        },
    },
});

export const { addToCart, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;
