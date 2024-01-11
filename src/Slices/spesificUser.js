import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
    name : "specificUserSlice",
    initialState :{
        value : {name:undefined,token:undefined,image:undefined,isLoginStatus:false}
    },
    reducers:{
        spesificUpdateUser : (state,action) => {
            var data = action.payload
            state.value = data
        }
    }
});

export const {spesificUpdateUser} = slice.actions;
export default slice.reducer