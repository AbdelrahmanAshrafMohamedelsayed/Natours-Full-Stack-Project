import { createSlice } from "@reduxjs/toolkit";

const initialuserState = {
  user: {},
  token: null,
};
const userslice = createSlice({
  name: "user",
  initialState: initialuserState,
  reducers: {
    Setuser(state, action) {
      const user = action.payload;
      state.user = user;
    },
    setToken(state, action) {
      const token = action.payload;
      state.token = token;
    },
    Removedata(state) {
      state.user = {};
      state.token = null;
    },
  },
});
export const userActions = userslice.actions;
export default userslice.reducer;
