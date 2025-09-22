import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "./taskSlice";

const store = configureStore({
    reducer:{
        stasks: taskReducer
    }
});
export default store;