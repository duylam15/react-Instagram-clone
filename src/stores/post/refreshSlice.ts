import { createSlice } from "@reduxjs/toolkit";

const refreshSlice = createSlice({
	name: "refresh",
	initialState: { trigger: 0 },
	reducers: {
		refresh: (state) => {
			state.trigger += 1; // Mỗi lần gọi sẽ tăng giá trị để trigger useEffect
		},
	},
});

export const { refresh } = refreshSlice.actions;
export default refreshSlice.reducer;
