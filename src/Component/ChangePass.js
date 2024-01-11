import { useRef, useState } from "react"
import WebApi from "../WebServices/WebApi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import WebMathodes from "../WebServices/WebMathodes";
import { updateUser } from "../Slices/UserSlice";

export default function ChangePass(){

    const dispatch = useDispatch();
    const navigate = useNavigate();
    var userData = useSelector(state=> state.userInfo.value)
    const [rspnMsg,setRspnMsg] = useState();
    const oldPass= useRef()
    const newPass= useRef()

    var saveChange=async (event)=>{
        event.preventDefault();
        var obj ={
            old_password : oldPass.current.value ,
            new_password : newPass.current.value
        }        
        const rspn = await WebMathodes.putApi(WebApi.updatePassword,userData.token,obj)
        setRspnMsg(rspn.message)
        console.log(JSON.stringify(rspn))
        if(rspn.status){
            dispatch(updateUser({...userData,isLoginStatus:false}))
            navigate("/log-in")
        }
    }

    return<div>
        <h1 className="alert-danger text-center m-3">Reset Password</h1>
        <div className="container p-3 mt-5">
            <form onSubmit={saveChange}>
            <div className=" row m-3">
                <div className="col col-sm-6 col-lg-4" >
                    <label style={{fontSize:"18px",color:"black"}}>OLD PASSWORD</label>
                    <input type="password" className="form-control" ref={oldPass} placeholder="old password" required/>
                </div>
                <div className="col col-sm-6 col-lg-4" >
                <label style={{fontSize:"18px",color:"black"}}>NEW PASSWORD</label>
                <input type="password" className="form-control" ref={newPass} placeholder="new password" required/>
                </div>
                <div className="col col-sm-6 col-lg-4 mt-4" >
                    <button className="btn btn-danger">Save Changes</button>
                </div>
            </div>

           
            </form>
            <br/>
            <b className="text-danger">{rspnMsg}</b>
        </div>
    </div>
}