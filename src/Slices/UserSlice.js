import { createSlice } from "@reduxjs/toolkit";
const dataFromLocalStorage = JSON.parse(localStorage.getItem('chatBuddyLogeInData')) || {};
var initialState ={
    value : {
        name: dataFromLocalStorage.name || undefined,
        token: dataFromLocalStorage.token || undefined,
        image: dataFromLocalStorage.image || undefined,
        isLoginStatus: dataFromLocalStorage.isLoginStatus || false 
    }
}

const slice = createSlice({
    name : "userSlice",
    initialState,
    reducers:{
        updateUser : (state,action) => {
            var data = action.payload
            state.value = data
        }
    }
});

export const {updateUser} = slice.actions;
export default slice.reducer