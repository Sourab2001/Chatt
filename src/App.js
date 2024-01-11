import About from "./Component/About";
import Header from "./Component/Header";
import Lognin from "./Component/Login";
import Signup from "./Component/Signup";
import { Route, Routes } from "react-router-dom";
import Profile from "./Component/Profile";
import UserHome from "./Component/UserHome";
import ChangePass from "./Component/ChangePass"
import UpdateUserInfo from "./Component/UpdateUserInfo";
import SpesificUserProfile from "./Component/SpesificUserProfile";
import AllUsers from "./Component/AllUsers";
import { useSelector } from "react-redux";
import Error from "./Component/Error"

export default function App(){
  const userData = useSelector(state=>state.userInfo.value)
  return <div>
    <Header/>
    <Routes>
  {userData.isLoginStatus?
  <>
    <Route path="/userhome" element={<UserHome/>}/>
    <Route path="/update-user-info" element={<UpdateUserInfo/>}/>
    <Route path="/changepassword" element={<ChangePass/>}/>
    <Route path="/about" element={<About/>}/>
    <Route path="/profile" element={<Profile/>} />
    <Route path="/specific-user-profile" element={<SpesificUserProfile/>} />
    <Route path="/all-users" element={<AllUsers/>} />
    </>
  : 
  <>
  <Route path="/" element={<Lognin/>}/>
    <Route path="/sign-up" element={<Signup/>}/>
    </>    
  }
<Route path="*" element={<Error/>}/>
    </Routes>
  </div>
}