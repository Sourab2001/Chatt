import { useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { spesificUpdateUser } from "../Slices/spesificUser"
import { useNavigate } from "react-router-dom"

export default function AllUsers(){
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const [changes,setChanges] = useState(false)
    var searchData = useRef()
    const usersList = useSelector(state=>state.usersList.value)

    var matchName=(nm)=>{
        if(searchData.current==undefined){
            return true
        }
        if(searchData.current.value.toLowerCase()==nm.slice(0,searchData.current.value.length).toLowerCase()){
            return true
        }
        else {
            return false
        }
    }

    var matchId=(data)=>{
        if(searchData.current==undefined){
            return true
        }
        if(searchData.current.value==data.toString().slice(0,searchData.current.value.length)){
            return true
        }
        else {
            return false
        }
    }

    var userInfoPage=(ob)=>{
        dispatch(spesificUpdateUser(ob))
        navigate("/specific-user-profile")
    }

    return<div>
        <div className="row m-3">
            <div className="col-10">
                <input onChange={()=>{setChanges(!changes)}} ref={searchData} className="m-4 form-control" placeholder="Search By Name / id"/>
            </div>
            <div className="col-2">
                <h4 className="text-center m-4">Users {usersList.filter(ob=>matchName(ob.name) || matchId(ob.id)).length}</h4>
            </div>
        </div>
        <ul style={{listStyle:"none",paddingTop:"20px"}}>
            {usersList.filter(ob=>matchName(ob.name) || matchId(ob.id)).map(ob=><li onClick={()=>userInfoPage(ob)} style={{cursor:"pointer"}} className="m-2">
                {ob.image? 
                <img style={{borderRadius:"50%"}} src={ob.image} height={40} width={40}/>                
                : 
                <img style={{borderRadius:"50%"}} src="blankPic.jpeg" height={40} width={40}/>
                }
                <b style={{color:"black",marginLeft:"7px"}}>{ob.name}</b><hr/>
                </li>
            )}
        </ul>
    </div>
}