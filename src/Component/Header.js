import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { updateUser } from "../Slices/UserSlice";

export default function Header(){
    const dispatch = useDispatch();
    const navigate = useNavigate();
    var userInfo = useSelector(state=>state.userInfo.value)
    var logout = ()=>{
        dispatch(updateUser({...userInfo,isLoginStatus:false}))
        navigate("/")
    }
    const data = useSelector(state=>state.userInfo.value)
    return <div>
        <nav className="navbar navbar-expand-lg bg-white navbar-light shadow sticky-top p-0">
            <a href="index.html" className="navbar-brand d-flex align-items-center text-center py-0 px-4 px-lg-5">
                <h1 className="m-0 text-secondary">Chat Buddy</h1>
            </a>
            <button type="button" className="navbar-toggler me-4" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                <span className="navbar-toggler-icon"></span>
            </button>
            {data.isLoginStatus?
            <div className="collapse navbar-collapse" id="navbarCollapse">
            <div className="navbar-nav ms-auto p-4 p-lg-0">
                <Link to={"/userhome"} className="text-center nav-item nav-link active"><img style={{borderRadius:"50%"}} height={40} width={40} src="homeIcon.jpg"/></Link>
                <Link to={"/all-users"} className="text-center nav-item nav-link"><img height={40} width={40} src="usersIcon.jpg"/></Link>
                <Link to={"/profile"} className="text-center nav-item nav-link"><img style={{borderRadius:"50%"}} height={40} width={40} src={userInfo.image}/></Link>
                <button style={{border:"0px",backgroundColor:"white"}}><img onClick={logout} height={40} width={40} src="logOutIcon.jpeg"/></button>
            </div>
        </div>
             : 
            <div className="collapse navbar-collapse" id="navbarCollapse">
            <div className="navbar-nav ms-auto p-4 p-lg-0">
                <Link to={"/"} className="nav-item nav-link">Log-in</Link>
                <Link to={"/sign-up"} className="nav-item nav-link">Sign-up</Link>
            </div>
        </div>
            }
        </nav>
    </div>
}