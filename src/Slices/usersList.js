import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    value : JSON.parse(localStorage.getItem('chatBuddyUL')) || []
}

const slice = createSlice({
    name : "usersList",
    initialState,
    reducers:{
        updateUsersList : (state,action) => {
            var data = action.payload
            state.value = data
        }
    }
});

export const {updateUsersList} = slice.actions;
export default slice.reducer