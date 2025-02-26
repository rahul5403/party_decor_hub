import { createSlice } from "@reduxjs/toolkit";

const pincodeSlice = createSlice({
  name: "pincode",
  initialState: {
    userPincode: null,
  },
  reducers: {
    setPincode: (state, action) => {
      state.userPincode = action.payload;
    },
  },
});

export const { setPincode } = pincodeSlice.actions;
export default pincodeSlice.reducer;
