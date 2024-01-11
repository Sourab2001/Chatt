import { useRef, useState } from "react"
import WebApi from "../WebServices/WebApi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import WebMathodes from "../WebServices/WebMathodes";
import { updateUser } from "../Slices/UserSlice";

export default function UpdateUserInfo(){

    const dispatch = useDispatch();
    const navigate = useNavigate();
    var userData = useSelector(state=> state.userInfo.value)
    const [rspnMsg,setRspnMsg] = useState();
    const nameBox= useRef()
    const numberBox= useRef()

    var saveChange=async (event)=>{
        event.preventDefault();
        var obj ={
            name : nameBox.current.value , phone : numberBox.current.value
        }     
        const rspn = await WebMathodes.putApi(WebApi.updateUserInfo,userData.token,obj)
        setRspnMsg(rspn.message)
        console.log(JSON.stringify(rspn))
        if(rspn.status){
            navigate("/profile")
        }
    }

    return<div>
        <h1 className="alert-danger text-center m-3">Update Information</h1>
        <div className="container p-3 mt-5">
            <form onSubmit={saveChange}>
            <div className=" row m-3">
                <div className="col col-sm-6 col-lg-4" >
                    <label style={{fontSize:"18px",color:"black"}}>Name</label>
                    <input type="text" className="form-control" ref={nameBox} placeholder="Enter Name" required/>
                </div>
                <div className="col col-sm-6 col-lg-4" >
                <label style={{fontSize:"18px",color:"black"}}>Number</label>
                <input type="number" className="form-control" ref={numberBox} placeholder="XXXXXXXXXX" required/>
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