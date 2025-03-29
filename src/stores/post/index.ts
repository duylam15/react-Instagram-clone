import { configureStore } from "@reduxjs/toolkit";
import refreshReducer from "./refreshSlice";

const store = configureStore({
	reducer: {
		refresh: refreshReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
