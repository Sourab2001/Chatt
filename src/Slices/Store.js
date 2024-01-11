import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./UserSlice"
import postList from "./postList";
import usersList from "./usersList";
import spesificUser from "./spesificUser";

const store = configureStore({
    reducer:{
        userInfo:userSlice,
        postList : postList,
        usersList : usersList,
        spesificUser : spesificUser
    }
})

store.subscribe(()=>{
    const {name,token,image,isLoginStatus} = store.getState().userInfo.value;
    const dataForLocalStorage = JSON.stringify({name,token,image,isLoginStatus})
    localStorage.setItem('chatBuddyLogeInData',dataForLocalStorage);
    localStorage.setItem('chatBuddyUL',JSON.stringify(store.getState().usersList.value));
    localStorage.setItem('chatBuddyPL',JSON.stringify(store.getState().postList.value));
})

export default store