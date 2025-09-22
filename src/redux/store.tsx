import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "./taskSlice";

// Tạo store
const store = configureStore({
  reducer: {
    stasks: taskReducer,
  },
});

// Type cho RootState (dùng để select state)
export type RootState = ReturnType<typeof store.getState>;

// Type cho dispatch
export type AppDispatch = typeof store.dispatch;

export default store;
