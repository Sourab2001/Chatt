import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import WebMathodes from "../WebServices/WebMathodes"
import WebApi from "../WebServices/WebApi"

export default function SpesificUserProfile(){

    var loadMsg= async()=>{
        if(!chatStatus){
            const rspn = await WebMathodes.getApi(WebApi.specificUserMsg+userData.id,loginUserData.token)
            //console.log("rspn ",rspn.data.data)
            setMsgs(rspn.data.data.map(ms=>ms.receiverId==userData.id?<div className="resivedMsg"><b className="msg">{ms.msg}</b></div> : <div className="sentMsg text-end"><b className="msg">{ms.msg}</b></div>))
            //console.log("call ")
        }
    }

    var msgToSend = useRef()
    const [msgs,setMsgs]= useState(["loading..."])

    const [allComments,setAllComments] = useState([])
    var comment = useRef({value : undefined})

    const [chatStatus,setChatStatus] = useState(true)
    const usersList = useSelector(state=>state.usersList.value)
    const [currentCmtId,setCmtId] = useState(-1)
    const postList = useSelector(state=>state.postList.value)
    const loginUserData = useSelector(state=>state.userInfo.value)

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
        const rspn = await WebMathodes.postApiAuthData(WebApi.saveComment,loginUserData.token,ob)
        if(rspn.data.status){
            var postUserData = postList.filter(ob=>ob.id==id)
            setAllComments([... postUserData[0].comments,rspn.data.data])
        }
    }

    var sendMSG=async()=>{
        var ob={
            receiverId : userData.id, msg : msgToSend.current.value
            }
        var rspn = await WebMathodes.postApiAuthData(WebApi.msgSend,loginUserData.token,ob)
        if(rspn.data.status){
            setMsgs([...msgs,<div className="sentMsg text-end"><b className="msg">{rspn.data.data.msg}</b></div>])
        }
    }

    
    
    useEffect(() => {
        const intervalId = setInterval(loadMsg, 1000);

        return () => clearInterval(intervalId);
    }, [chatStatus]);

    useEffect(()=>{
        loadMsg()
        if(chatStatus){window.scrollTo(0,0)}
    },[])

    
    var userData = useSelector(state=>state.spesificUser.value)
    return <div>
        
        <div className="row m-3 mt-5">
            <div style={{borderRadius:"10px",boxShadow:"0px 0px 15px lightgrey"}} className="col col-lg-4 col-sm-12 col-md-12 text-center m-3 p-3">
                <img src={userData.image} height={270} width={270} alt="Picture is Not Available"></img>
            </div>
            <div style={{borderRadius:"10px",boxShadow:"0px 0px 15px lightgrey"}} className="col col-lg-7 m-3 p-3">
                <div className="row m-2">
                    <div className="col-6">
                        <h5>ID</h5>
                        <h3 style={{color:"black"}}>{userData.id}</h3>
                    </div>
                    <div className="col-6">
                        <h5>Name</h5>
                        <h3 style={{color:"black"}}>{userData.name}</h3>
                    </div>
                </div><br/><hr/>
                <div className="row m-2">
                    <div className="col-6">
                        <h5>Email</h5>
                        <h3 style={{color:"black",overflow:"auto"}}>{userData.email}</h3>
                    </div>
                    <div className="col-6">
                        <h5>Number</h5>
                        <h3 style={{color:"black",overflow:"auto"}}>{userData.phone}</h3>
                    </div>
                </div><br/><hr/>
                <div className="row m-2">
                    <div className="col-6">
                        <button onClick={()=>setChatStatus(false)} style={{color:"black"}} className="form-control btn bg-secondary">Start Chat</button>
                    </div>
                    <div className="col-6">
                        <button onClick={()=>setChatStatus(true)} style={{color:"black"}}  className="form-control btn bg-info">Close Chat</button>
                    </div>
                </div>
            </div>
       
    </div> <hr/>
    <div hidden={chatStatus}>
        <div style={{borderRadius:"10px",boxShadow:"0px 0px 15px lightgrey",height:"200px",overflow:"auto"}} className="m-3 p-3">
        {msgs.map(ms=>ms)}
        </div>
        <div className="row m-3 p-3">
            <div className="col-8">
                <input ref={msgToSend} style={{borderRadius:"10px",boxShadow:"0px 0px 15px lightgrey"}} className="form-control" placeholder="Type Here"/>
            </div>
            <div className="col-4">
                <button onClick={sendMSG} style={{color:"black"}} className="form-control btn bg-warning">Send Massage</button>
            </div>
        </div>
    </div><hr/>

    <h1 className="text-center">USER POST</h1>
    {postList.filter(ob=>ob.postBy.id==userData.id).map(ob=>ob.postfile==null? 
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
                <div className="col-9">
                    <input  defaultValue={"Nice"} ref={comment} className="form-control" placeholder="Comment"/>
                </div>
                <div className="col clo-lg-2">
                    <button onClick={()=>postComment(ob.id)} className="col col-12 btn btn-secondary mb-1 p-0"><img height={50} width={50} src="sendIcon.png"/></button>
                </div>
                <div className="col clo-lg-1">
                    <button className="btn btn-warning mb-3 p-0" onClick={()=>loadCom(ob)}><img height={50} width={50} src="UpIcon.webp"/></button>
                </div>
            </div>
        </div>
        :
        <div className="row m-1">
        <div className="col-9">
            <input  defaultValue={"Nice"} ref={comment} className="form-control" placeholder="Comment"/>
        </div>
        <div className="col clo-lg-2">
            <button onClick={()=>postComment(ob.id)} className="col col-12 btn btn-secondary mb-1 p-0"><img height={50} width={50} src="sendIcon.png"/></button>
        </div>
        <div className="col clo-lg-1">
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
                <div className="col-9">
                    <input  defaultValue={"Nice"} ref={comment} className="form-control" placeholder="Comment"/>
                </div>
                <div className="col clo-lg-2">
                    <button onClick={()=>postComment(ob.id)} className="col col-12 btn btn-secondary mb-1 p-0"><img height={50} width={50} src="sendIcon.png"/></button>
                </div>
                <div className="col clo-lg-1">
                    <button className="btn btn-warning mb-3 p-0" onClick={()=>loadCom(ob)}><img height={50} width={50} src="UpIcon.webp"/></button>
                </div>
            </div>
        </div>
        :
        <div className="row m-1">
                <div className="col-9">
                    <input  defaultValue={"Nice"} ref={comment} className="form-control" placeholder="Comment"/>
                </div>
                <div className="col clo-lg-2">
                    <button onClick={()=>postComment(ob.id)} className="col col-12 btn btn-secondary mb-1 p-0"><img height={50} width={50} src="sendIcon.png"/></button>
                </div>
                <div className="col clo-lg-1">
                    <button className="btn btn-warning mb-3 p-0" onClick={()=>loadCom(ob)}><img height={50} width={50} src="commentIcom.png"/></button>
                </div>
            </div>
        }       
    </div>
</div>
    )}
    </div>
}