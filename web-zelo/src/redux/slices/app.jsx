import { createSlice } from "@reduxjs/toolkit";

import { dispatch } from "../store";

const initialState = {
  sidebar: {
    open: false,
    type: "CONTACT", // can be CONTACT, STARRED, SHARED
  },
};

const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    //tonggle Siderbar
    toggleSidebar(state, action) {
      state.sidebar.open = !state.sidebar.open;
    },
    updateSiderbarType(state, action) {
      state.sidebar.type = action.payload.type;
    },
  },
});

export default slice.reducer;

//

export function TonggleSiderbar() {
  return async () => {
    dispatch(slice.actions.toggleSidebar());
  };
}

export function UpdateSiderbarType(type) {
  return async () => {
    dispatch(slice.actions.updateSiderbarType({ type }));
  };
}
