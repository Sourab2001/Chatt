import { useState } from "react";
import { useRef } from "react"
import { useNavigate } from "react-router-dom";
import WebApi from "../WebServices/WebApi";
import Mathodes from "../WebServices/WebMathodes"

export default function Signup(){
    const navigate = useNavigate();
    const [resultMsg,setresultMsg] = useState();
    const nameBox = useRef()
    const numberBox = useRef()
    const emailBox = useRef()
    const passwordBox = useRef()
    const genderBox = useRef()
    
    var add= async (event)=>{
        event.preventDefault();
        var ob ={
        name : nameBox.current.value , phone : numberBox.current.value , 
	    email : emailBox.current.value , password : passwordBox.current.value, 
	    gender : genderBox.current.value
        }
        const rspn = await Mathodes.postApi(WebApi.registerAPI,ob)
        if(rspn.data.status){
            navigate("/")
        }
          setresultMsg(rspn.data.message)
    }
    return <div>
        <h1 style={{boxShadow:"0px 0px 10px lightgrey",borderRadius:"10px"}} className="alert-danger text-center m-4">Signup</h1>
        <div className="container p-3 mt-5">
            <form style={{boxShadow:"0px 0px 10px lightgrey",borderRadius:"10px",padding:"20px"}} onSubmit={add}>
            <div className=" row m-3">
                <div className="col col-sm-6" >
                    <label style={{fontSize:"18px",color:"black"}}>Name</label>
                    <input type="text" className="form-control" ref={nameBox} placeholder="Enter Name" required/>
                </div>
                <div className="col col-sm-6" >
                <label style={{fontSize:"18px",color:"black"}}>Number</label>
                <input type="number" className="form-control" ref={numberBox} placeholder="XXXXXXXXXX" required/>
                </div>
            </div>

            <div className=" row m-3">
                <div className="col col-sm-6" >
                <label style={{fontSize:"18px",color:"black"}}>Email</label>
                <input type="email" className="form-control" ref={emailBox} placeholder="Enter Email" required/>
                </div>
                <div className="col col-sm-6" >
                <label style={{fontSize:"18px",color:"black"}}>password</label>
                <input type="password" className="form-control" ref={passwordBox} placeholder="Enter password" required/>
                </div>
            </div>

            <div className=" row m-3">
                <div className="col col-sm-6" >
                <label style={{fontSize:"18px",color:"black"}}>Gender</label>
                <select className="form-control" ref={genderBox}>
                <option>Male</option>
                <option>Female</option>
                </select>
                </div>
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