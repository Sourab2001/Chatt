import { useEffect, useRef, useState } from "react"
import {  useDispatch, useSelector } from "react-redux"
import WebMathodes from "../WebServices/WebMathodes";
import WebApi from "../WebServices/WebApi";
import { useNavigate } from "react-router-dom";
import { updateUsersList } from "../Slices/usersList";
import { updateList } from "../Slices/postList";
import { updateUser } from "../Slices/UserSlice"; 

export default function Profile(){
    const [allComments,setAllComments] = useState([])
    var comment = useRef({value : undefined})

    const usersList = useSelector(state=>state.usersList.value)
    const [currentCmtId,setCmtId] = useState(-1)
    const postList = useSelector(state=>state.postList.value)
    const dispatch = useDispatch()

    var loadCom=(ob)=>{
        if(currentCmtId==-1){
            setCmtId(ob.id)
            setAllComments(ob.comments)
        }
        else{
            if(ob.id!=currentCmtId){
                setCmtId(ob.id)
                setAllComments(ob.comments)
            }
            else{
                setCmtId(-1)
            }
        }
    }

    var postComment= async (id)=>{
        var ob = {
            comment : comment.current.value , post: id
        }
        const rspn = await WebMathodes.postApiAuthData(WebApi.saveComment,userData.token,ob)
        console.log("cmtpr",rspn)
        if(rspn.data.status){
            var postUserData = postList.filter(ob=>ob.id==id)
            setAllComments([... postUserData[0].comments,rspn.data.data])
        }
    }

    const navigate = useNavigate();
    

    const userPic = useRef()
    const nameBox = useRef()
    const numberBox = useRef()

    var [userProfile,setProfile] = useState([]);
    const userData=useSelector(state=>state.userInfo.value)

    var loadPost=async()=>{
        const rspn = await WebMathodes.getApi(WebApi.postList,userData.token)
        dispatch(updateList(rspn.data.data.map(cmt=>{
            if(cmt.postfile && cmt.postfile.slice(12,26)=='skilledfresher'){
                cmt.postfile=cmt.postfile.replace('skilledfresher','codebetter')
            }
            if(cmt.postBy.image && cmt.postBy.image.slice(12,26)=='skilledfresher'){
                cmt.postBy.image=cmt.postBy.image.replace('skilledfresher','codebetter')
            }
             return {...cmt,cmtStatus:false}
            })))
    }

    useEffect(()=>{
        loadProfile();
        loadUsersList()
        loadPost()
    },[])

    var loadUsersList=async()=>{
        const rspn = await WebMathodes.getApi(WebApi.userList,userData.token)
        dispatch(updateUsersList(rspn.data.data.map(urs=>{
            if(urs.image && urs.image.slice(12,26)=='skilledfresher'){
                urs.image=urs.image.replace('skilledfresher','codebetter')
            }
            return urs
        })))
    }

    var loadProfile= async()=>{
        var rspn = await WebMathodes.getApi(WebApi.loginUserInfo,userData.token)
        if(rspn.data.status){
            setProfile(rspn.data.data)
            dispatch(updateUser({...userData,id : rspn.data.data.id}))
        }
    }

    var updateImage= async (event)=>{
        event.preventDefault()
        const fdata = new FormData();
        fdata.append('image',userPic.current.files[0]);
        const rspn = await WebMathodes.putApi(WebApi.userPic,userData.token,fdata) 
        if(rspn.status){
            loadProfile();
        }
    }
    return <>
    <h1 className="alert-danger m-5 text-center">Profile</h1>

    <div className="container">
        <div className="row">
            <div style={{borderRadius:"10px",boxShadow:"0px 0px 15px lightgrey"}} className="col col-lg-4 col-sm-12 col-md-12 text-center m-2">
                <h4 className="alert-info mt-1">ID : {userProfile.id}</h4>
                <img src={userProfile.image} height={270} width={270} alt="Picture is Not Available"></img>
                <form onSubmit={updateImage}>
                    <div className="row m-1">
                        <div className="col-6">
                            <input ref={userPic} className="form-control alert-info" type="file"/>
                        </div>
                        <div className="col-6">
                            <button className="btn btn-info">Update Picture</button>
                        </div>
                    </div>
                </form>
            </div>

            <div style={{borderRadius:"10px",boxShadow:"0px 0px 15px lightgrey"}} className="col col-lg-7 col-sm-12 col-md-12 m-2">
            <form onSubmit={()=>navigate("/update-user-info")}>
            <div className=" row m-3">
                <div className="col col-sm-6" >
                    <label style={{fontSize:"18px",color:"black"}}>Name</label>
                    <input value={userProfile.name} type="text" className="form-control" ref={nameBox} placeholder="Enter Name" required/>
                </div>
                <div className="col col-sm-6" >
                <label style={{fontSize:"18px",color:"black"}}>Number</label>
                <input value={userProfile.phone} type="number" className="form-control" ref={numberBox} placeholder="XXXXXXXXXX" required/>
                </div>
            </div>

            <div className=" row m-3">
                <div className="col col-sm-6" >
                <label style={{fontSize:"18px",color:"black"}}>Email</label>
                <input value={userProfile.email} readOnly type="email" className="form-control" placeholder="Enater Email" required/>
                </div>
                <div className="col col-sm-6" >
                <label style={{fontSize:"18px",color:"black"}}>Gender</label>
                <select readOnly value={userProfile.gender} className="form-control">
                <option>Male</option>
                <option>Female</option>
                </select>
                </div>
            </div>

            <div className=" row m-3">
            <div className="col col-sm-6 mt-4" >
                    <i><u className="text-info" style={{cursor:"pointer"}} onClick={()=>navigate("/changepassword")}>Change Password</u></i>
                </div>
                <div className="col col-sm-6 mt-4" >
                    <button className="btn btn-info">Update Profile</button>
                </div>
            </div>
            </form>
            </div>
        </div>
    </div>
<hr/>
<h1 className="text-center">YOUR POST</h1>
{postList.filter(ob=>ob.postBy.id==userProfile.id).map(ob=>ob.postfile==null? 
    <div style={{borderRadius:"10px",boxShadow:"0px 0px 15px lightgrey"}} className="m-5">
    <div className="row m-2">
        <div style={{cursor:"pointer"}} className="col col-lg-6 mt-2">
            <img style={{borderRadius:"50%"}} src={ob.postBy.image} height={40} width={40}></img>
            <b className="m-2" style={{color:"black"}}>{ob.postBy.name}</b>
        </div>
        <div style={{display:"flex",justifyContent:"flex-end"}} className="col col-lg-6 mt-2">
            <b style={{color:"black"}}>Posted on : {ob.postdate.slice(0,10)} </b>
        </div>
    </div>
    <div className="row p-3 text-center ">
        <div className="col col-lg-12 mt-2 mb-2">
            <p style={{overflow:"auto",color:"black"}}>{ob.message}</p>
        </div>
    </div>
    <div className="row m-3">
        {ob.id==currentCmtId?<div>
            <div style={{color:"black",listStyle:"none"}}>
                {allComments.map(cm=><div className="m-2 p-2" style={{}}>
                    {usersList.map(ull=>{if(ull.id==cm.sender){return<div> <img style={{borderRadius:"50%"}} src={cm.image} height={30} width={30}/><b className="m-2">{ull.name}</b></div>}})}<br/>
                    &nbsp;&nbsp;&nbsp;<i>{cm.comment}</i><hr/>
                    </div>)}
            </div>
            <div className="row m-1">
                <div className="col-10">
                    <input  defaultValue={"Nice"} ref={comment} className="form-control" placeholder="Comment"/>
                </div>
                <div className="col-1">
                    <button onClick={()=>postComment(ob.id)} className="col col-12 btn btn-secondary mb-3 p-0"><img height={50} width={50} src="sendIcon.png"/></button>
                </div>
                <div className="col-1">
                    <button className="btn btn-warning mb-3 p-0" onClick={()=>loadCom(ob)}><img height={50} width={50} src="UpIcon.webp"/></button>
                </div>
            </div>
        </div>
        :
        <div className="row m-1">
        <div className="col-1">
            <input  defaultValue={"Nice"} ref={comment} className="form-control" placeholder="Comment"/>
        </div>
        <div className="col-1">
            <button onClick={()=>postComment(ob.id)} className="col col-12 btn btn-secondary mb-3 p-0"><img height={50} width={50} src="sendIcon.png"/></button>
        </div>
        <div className="col-1">
            <button className="btn btn-warning mb-3 p-0" onClick={()=>loadCom(ob)}><img height={50} width={50} src="commentIcom.png"/></button>
        </div>
    </div>
        }       
    </div>
</div>
    : 
    <div style={{borderRadius:"10px",boxShadow:"0px 0px 15px lightgrey"}} className="m-5">
    <div className="row m-2">
        <div style={{cursor:"pointer"}} className="col col-lg-6 mt-2">
            <img style={{borderRadius:"50%"}} src={ob.postBy.image} height={40} width={40}></img>
            <b className="m-2" style={{color:"black"}}>{ob.postBy.name}</b>
        </div>
        <div style={{display:"flex",justifyContent:"flex-end"}} className="col col-lg-6">
            <b  style={{color:"black"}}>Posted on : {ob.postdate.slice(0,10)} </b>
        </div>
    </div>
    <div className="row p-3 text-center ">
        <div className="col col-lg-6">
            <img height={250} width={300} src={ob.postfile}/>
        </div>
        <div className="col col-lg-6 mt-2 mb-2">
            <p style={{overflow:"auto",color:"black"}}>{ob.message}</p>
        </div>
    </div>
    <div className="row m-3">
        {ob.id==currentCmtId?<div>
            <div style={{color:"black",listStyle:"none"}}>
                {allComments.map(cm=><div className="m-2 p-2" style={{}}>
                    {usersList.map(ull=>{if(ull.id==cm.sender){return<div> <img style={{borderRadius:"50%"}} src={cm.image} height={30} width={30}/><b className="m-2">{ull.name}</b></div>}})}<br/>
                    &nbsp;&nbsp;&nbsp;<i>{cm.comment}</i><hr/>
                    </div>)}
            </div>
            <div className="row m-1">
                <div className="col-10">
                    <input  defaultValue={"Nice"} ref={comment} className="form-control" placeholder="Comment"/>
                </div>
                <div className="col-1">
                    <button onClick={()=>postComment(ob.id)} className="col col-12 btn btn-secondary mb-3 p-0"><img height={50} width={50} src="sendIcon.png"/></button>
                </div>
                <div className="col-1">
                    <button className="btn btn-warning mb-3 p-0" onClick={()=>loadCom(ob)}><img height={50} width={50} src="UpIcon.webp"/></button>
                </div>
            </div>
        </div>
        :
        <div className="row m-1">
                <div className="col-10">
                    <input  defaultValue={"Nice"} ref={comment} className="form-control" placeholder="Comment"/>
                </div>
                <div className="col-1">
                    <button onClick={()=>postComment(ob.id)} className="col col-12 btn btn-secondary mb-3 p-0"><img height={50} width={50} src="sendIcon.png"/></button>
                </div>
                <div className="col-1">
                    <button className="btn btn-warning mb-3 p-0" onClick={()=>loadCom(ob)}><img height={50} width={50} src="commentIcom.png"/></button>
                </div>
            </div>
        }       
    </div>
</div>
    )}
    </>
}