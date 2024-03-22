import { configureStore } from "@reduxjs/toolkit";
import socketReducer from "../components/socketSlice"
import userReducer from "../features/Auth/userSlice";
import settingsReducer from "./reducers/settings";

const rootReducer = {
  user: userReducer,
  settings: settingsReducer,
  socket: socketReducer,
  
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export default store;
