import { useDispatch, useSelector } from "react-redux";
import { addToPL, replaceInPL, updateList } from "../Slices/postList";
import WebMathodes from "../WebServices/WebMathodes";
import WebApi from "../WebServices/WebApi";
import { useRef } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { spesificUpdateUser } from "../Slices/spesificUser";

export default function UserHome(){

    const [allComments,setAllComments] = useState([])
    var comment = useRef({value : undefined})
    const navigate = useNavigate()
    const FileForPost = useRef({files:[1]})
    const textForPost = useRef()
    var [responseStatus,setResponseStatus]= useState(true)
    var [postStatus,setPostStaus] = useState(true)
    const usersList = useSelector(state=>state.usersList.value)
    const [currentCmtId,setCmtId] = useState(-1)
    const postList = useSelector(state=>state.postList.value)
    const userData = useSelector(state=>state.userInfo.value)
    console.log(userData)
    const dispatch = useDispatch()

    var loadCom=(ob)=>{
        var cmt = ob.comments==undefined ? [] : ob.comments
        if(currentCmtId==-1){
            setCmtId(ob.id)
            setAllComments(cmt)
        }
        else{
            if(ob.id!=currentCmtId){
                setCmtId(ob.id)
                setAllComments(cmt)
            }
            else{
                setCmtId(-1)
            }
        }
    }

    var postData= async (event)=>{
        event.preventDefault()
        setResponseStatus(false)
        var rspn = undefined
        if(FileForPost.current.files[0]!=undefined){
            const fdata = new FormData();
            fdata.append('image',FileForPost.current.files[0]);
            fdata.append('message',textForPost.current.value);
            rspn = await WebMathodes.postApiAuthData(WebApi.userPostSave,userData.token,fdata)
        }
        else{
            var ob={
                message : textForPost.current.value
            }
            rspn = await WebMathodes.postApiAuthData(WebApi.userPostSave,userData.token,ob)
        }
        if(rspn){setResponseStatus(true)}
        if(rspn.data.status){
            var data = undefined
            if(FileForPost.current.files[0]!=undefined){
                data = {...rspn.data.data,postBy: {
                        id: userData.id,
                        name: userData.name,
                        image: userData.image
                    } ,
                    comments : []
                }
            }else{
                data = {...rspn.data.data,postfile:null,postBy: {
                            id: userData.id,
                            name: userData.name,
                            image: userData.image
                        }  ,
                    comments : []
                    }
            }
            dispatch(addToPL(data))
            event.target.reset()
        }
    }

    var userInfoPage=(ob)=>{
        dispatch(spesificUpdateUser(ob.postBy))
        navigate("/specific-user-profile")
    }

    var postComment= async (id)=>{
        var ob = {
            comment : comment.current.value , post: id
        }
        const rspn = await WebMathodes.postApiAuthData(WebApi.saveComment,userData.token,ob)
        if(rspn.data.status){
            var postUserData = postList.filter(ob=>ob.id==id)
            setAllComments([...postUserData[0].comments,rspn.data.data])
        }
    }

    const imageStyle = {
        textDecoration: 'line-through',
        opacity: 0.6,
        height: '50px',
        width: '50px',
      };

    return <>
    <div className="row p-3">
        <div className="col col-lg-6">
            <Link to={"/profile"}><img style={{borderRadius:"50%"}} src={userData.image} height={150} width={150}/></Link>
            <h1>{userData.name}</h1>
        </div>
        
        <div className="col col-lg-3 container text-center">
        <b onClick={()=>{setPostStaus(false)}} style={{cursor:"pointer",fontWeight:"bolder",color:"black"}} className="form-control bg-info mt-3">Create Your Post </b>
        </div>
    </div><hr/>
    <div hidden={postStatus}>
        <div hidden={responseStatus} className="text-center">
            <button class="btn btn-warning">
                <span class="spinner-border"></span><br/>
                Loading...
            </button>
        </div>
        <form onSubmit={postData}>
        <div className="row p-3">
        <div className="col col-lg-8">
                    <textarea ref={textForPost} defaultValue={"Happiness is a joy Forever"} style={{borderRadius:"10px",border:"0px",boxShadow:"0px 0px 10px lightgrey",color:"black",fontWeight:"bolder"}} className="form-control text-center" placeholder="Enter Text" />            
            </div>
            <div className="col col-lg-4">
                    <input style={{height:"50px"}} ref={FileForPost} type="file"/>
            </div>            
        </div>
        <div className="row p-3">
        <div className="col col-lg-4 container text-center">
                <button type="reset" style={{cursor:"pointer",fontWeight:"bolder",color:"black"}} className="form-control bg-secondary">Reset</button>
            </div>
            <div className="col col-lg-4 container text-center">
                <button type="submit" style={{cursor:"pointer",fontWeight:"bolder",color:"black"}} className="form-control bg-secondary">Post</button>
            </div>
            <div className="col col-lg-4 container text-center">
                <b onClick={()=>{setPostStaus(true)}} style={{cursor:"pointer",fontWeight:"bolder",color:"black"}} className="form-control bg-secondary">Cancel</b>
            </div><hr className="mt-3"/>
        </div>
        </form>
    </div>
    

    {postList.map(ob=>ob.postfile==null? 
    <div style={{borderRadius:"10px",boxShadow:"0px 0px 15px lightgrey"}} className="m-5">
    <div className="row m-2">
        <div style={{cursor:"pointer"}} onClick={()=>userInfoPage(ob)} className="col col-lg-6 mt-2">
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
                    <button onClick={()=>postComment(ob.id)} className="col col-12 btn btn-secondary mb-1 p-0"><img height={50} width={50} src="sendIcon.png"/></button>
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
    : 
    <div style={{borderRadius:"10px",boxShadow:"0px 0px 15px lightgrey"}} className="m-5">
    <div className="row m-2">
        <div style={{cursor:"pointer"}} onClick={()=>userInfoPage(ob)} className="col col-lg-6 mt-2">
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