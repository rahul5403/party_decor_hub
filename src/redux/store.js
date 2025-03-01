import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import authReducer from "./authSlice";
import pincodeReducer from "./pincodeSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";

// 👇 Persist only cart & auth, but exclude pincode
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart", "auth"], // Only persist these reducers
};

// Combine reducers
const rootReducer = combineReducers({
  cart: cartReducer,
  auth: authReducer,
  pincode: pincodeReducer, // This won't be persisted
});

// Apply persist only to selected reducers
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
