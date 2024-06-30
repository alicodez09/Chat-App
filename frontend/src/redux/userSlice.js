import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: "",
  name: "",
  email: "",
  profile_pic: "",
  phone: "",
  token: "",
  onlineUser: [],
  socketConnection: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state._id = action.payload._id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.phone = action.payload.phone;
      state.profile_pic = action.payload.profile_pic;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setOnlineUser: (state, action) => {
      state.onlineUser = action.payload;
    },
    logout: (state, action) => {
      state._id = "";
      state.name = "";
      state.email = "";
      state.phone = "";
      state.profile_pic = "";
      state.token = "";
      state.socketConnection = null;
    },
    setSocket: (state, action) => {
      state.socketConnection = action.payload;
    },
  },
});

export const { setUser, setToken, setOnlineUser, logout, setSocket } =
  userSlice.actions;

export default userSlice.reducer;
