import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    value : JSON.parse(localStorage.getItem('chatBuddyPL')) || []
}

const slice = createSlice({
    name : "postSlice",
    initialState,
    reducers:{
        updateList : (state,action) => {
            var data = action.payload
            state.value = data
        },
        addToPL : (state,action)=>{
            state.value = [action.payload,...state.value]
        },
        replaceInPL : (state,action)=>{
            var data = action.payload
            var newList = state.value.filter(ob=>ob.id!=data.id)
            state.value = [data,...newList]
        }
    }
});

export const {updateList,addToPL,replaceInPL} = slice.actions;
export default slice.reducer