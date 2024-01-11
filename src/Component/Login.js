import { useEffect, useRef, useState } from "react";
import { json, useNavigate } from "react-router-dom";
import WebApi from "../WebServices/WebApi";
import { useDispatch } from "react-redux";
import { updateUser } from "../Slices/UserSlice";
import WebMathodes from "../WebServices/WebMathodes";

export default function Login(){
    var [localData,setLocalData] = useState({email:undefined,password:undefined})
    const dispatch = useDispatch();
  const navigate = useNavigate();
  const [resultMsg,setresultMsg] = useState();
    var emailBox = useRef();
    var passwordBox = useRef();
    var add= async (event)=>{
      event.preventDefault();
        var ob={
            email : emailBox.current.value , password : passwordBox.current.value
        }
        const rspn = await WebMathodes.postApi(WebApi.loginAPI,ob);
        if(rspn.data.status){
            var dataForLocal = {email:emailBox.current.value,password:passwordBox.current.value}
            var loginDataForLocal = JSON.stringify(dataForLocal)
            localStorage.setItem('chatBuddy-login',loginDataForLocal)
          navigate("/profile")
          dispatch(updateUser({...rspn.data.data,isLoginStatus:true}))
        }
        setresultMsg(rspn.data.message)
    }
    var getLocalData=()=>{
        var data = localStorage.getItem('chatBuddy-login')
        if(data!=undefined){
            data = JSON.parse(data)
            setLocalData(data)
        }

    }
    useEffect(()=>{
        getLocalData()
    },[])
    return <div>
        <h1 style={{boxShadow:"0px 0px 10px lightgrey",borderRadius:"10px"}} className="alert-danger text-center m-5">LOG-IN</h1>
        <div className="container p-3 mt-5">
            <form style={{boxShadow:"0px 0px 10px lightgrey",borderRadius:"10px",padding:"20px"}} onSubmit={add}>

            <div className=" row m-3">
                <div className="col col-sm-6" >
                <label style={{fontSize:"18px",color:"black"}}>Email</label>
                <input defaultValue={localData.email} type="email" className="form-control" ref={emailBox} placeholder="Enater Email" required/>
                </div>
                <div className="col col-sm-6" >
                <label style={{fontSize:"18px",color:"black"}}>password</label>
                <input defaultValue={localData.password} type="password" className="form-control" ref={passwordBox} placeholder="Enter password" required/>
                </div>
            </div>

            <div className=" row m-3">
                <div className="col col-sm-6 mt-4" >
                    <button className="btn btn-info">Submit</button>
                </div>
            </div>
            </form>
            <br/>
            <b className="text-danger">{resultMsg}</b>
        </div>
    </div>
}