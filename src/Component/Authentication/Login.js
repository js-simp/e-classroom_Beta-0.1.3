import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox'
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import LockIcon from '@material-ui/icons/Lock';
import AuthLogin from "./Authentication";
import Home from '../Home';
import './Login.css'


const Login = () => {
    const [type, setType] = useState("password");
    const [logged, setLogged] = useState({'loggedIn' : false});
    const [err, setErr] = useState("");
   
    const [loginData, setLoginData] = useState({
    user :"",pass:""
    });
   
    const showPassword = (e) => {
        setErr("");  
        var status = e.target.checked.toString();
        if (status === "true") { 
         //  console.log(status); 
           setType("text");
         } else { setType("password"); }
    }

    const submitBtn=()=>{
        let lenUser = loginData.user.length;
        let lenPass = loginData.pass.length;
        let username =  loginData.user;
        let password = loginData.pass;
       // console.log("isgmail",isgmail);
        if(lenUser !== 0 && lenPass!== 0)
        { 
       console.log(loginData.user,loginData.pass);
        var obj =  new  AuthLogin();
        obj.userLoginFunction(username,password, setLogged);
    }else{
        setErr("Error !");  
    }
    }


    if(!logged.loggedIn && window.sessionStorage.getItem('role') === null){
    return (
        <div className = 'container'>
            <div className = 'card-block'>
                <div className= 'logo-container'>
                    <img className = 'icon-logo' src ="" alt='logo'></img>
                </div>
                <hr className = 'hr-line'></hr>
                <div className = 'wrapper'>
                    <p className = 'welcome-text'>Welcome to GoodWill Learning Platform</p>
                </div>
                <form onSubmit={(e)=>{e.preventDefault();}}>
                    <div className="wrapper wrapper-form">
                        {/* <label  className="form-label">Username</label> */}
                        <AccountCircleIcon className = 'form-icon' style={{ fontSize: 30 }}/>
                        <input onChange={ (e) => {
                            setLoginData({
                                ...loginData, user : e.target.value
                            });}
                        } type="text" className="form-control" id="exampleFormControlInput1" placeholder="Username" />
                <p style={{color:"red"}}>{err}</p>
                    </div>
                    <div className="wrapper wrapper-form">
                        {/* <label  className="form-label">Password</label> */}
                        <LockIcon className = 'form-icon' style={{ fontSize: 30 }}/>
                        <input onChange={ (e) => {
                            setLoginData({
                                ...loginData, pass : e.target.value
                            });
                        }
                        }  type={type} className="form-control" id="inputPassword" placeholder = 'Password'/>
                        <p style={{color:"red"}}>{err}</p>
                    </div>
                    <div className = 'wrapper wrapper-form'>
                        <Checkbox onChange={showPassword}>
                        </Checkbox> 
                        <p>Show password</p>
                    </div>
                    <div className = 'wrapper wrapper-form'>
                        <Button id = "submit-button" onClick={submitBtn} type="submit" style={{ color: "white", backgroundColor: '#1a237e' }} >Login</Button>
                    </div>
                </form>
            </div>
        </div>
    );
    }
    //this is for loading homepage when page is refreshed once user has logged in
    else if(window.sessionStorage.getItem('role') !== null){
        let role = window.sessionStorage.getItem('role');
        let UserId = window.sessionStorage.getItem('UserId')
        return(
            <Home
            role = {role}
            userId = {UserId}
            />
        )
    }
    else{
        return(
            <Home
            role = {logged.role}
            userId = {logged.UserId}
            />
        )
    }
}

export default Login;
