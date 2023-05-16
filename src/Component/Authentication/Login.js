import React, {useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox'
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import LockIcon from '@material-ui/icons/Lock';
import AuthLogin from "./Authentication";
import {auth} from '../Firebase/firebase';
import {onAuthStateChanged } from "firebase/auth";
import Home from '../Home';
import './Login.css'


const Login = () => {
    const [type, setType] = useState("password");
    const [logged, setLogged] = useState({loggedIn : false});
    // const [auth, setAuth] = useState(false);
    const [user, setUser] = useState('')
    const [err, setErr] = useState("");
   
    const [loginData, setLoginData] = useState({
    email :"",pass:""
    });

    useEffect(()=> {
        onAuthStateChanged(auth, (user) => {
            if (user) {
              // User is signed in, see docs for a list of available properties
              // https://firebase.google.com/docs/reference/js/firebase.User
              const uid = user.uid;
              let role;
              user.getIdTokenResult()
                .then((idTokenResult) => {
                    role = idTokenResult.claims.role
                    console.log(role)
                    setLogged({'loggedIn': true, 'role' : role, 'UserId' : user.uid})
                })
                .catch((error) => {
                    console.log(error);
                    setLogged({'loggedIn': true, 'role' : '', 'UserId' : user.uid})
                });
              
              setUser(user.email)
              // ...
            } else {
              // User is signed out
              setLogged({'loggedIn': false})
              // ...
            }
          });
          
    }, [])
   
    const showPassword = (e) => {
        setErr("");  
        var status = e.target.checked.toString();
        if (status === "true") { 
         //  console.log(status); 
           setType("text");
         } else { setType("password"); }
    }

    const submitBtn=()=>{
        let lenUser = loginData.email.length;
        let lenPass = loginData.pass.length;
        let email =  loginData.email;
        let password = loginData.pass;
       // console.log("isgmail",isgmail);
        if(lenUser !== 0 && lenPass!== 0)
        { 
        let obj =  new  AuthLogin();
        obj.userLoginFunction(email,password);
        }
        else{
        setErr("Error !");  
        }
    }

    const testRun = (e)=>{
        //go to test page
        let feature = {'wb' : false, 'chat' : false, 'call' : false};
        feature[`${e.currentTarget.id}`] = true;
        console.log(e)
        setLogged({'loggedIn': true, 'role' : 'test', 'feature' : feature , 'UserId' : '007'})
    }

    const logOut=()=>{
        let log = new AuthLogin();
        log.userLogoutFunction(setLogged);
    }

    if(!logged.loggedIn){
    return (
        <div className = 'split-containers'>
            <div className = 'test-container'>
                <div>
                    <p style={{textAlign  : 'center'}}>Haven't registered yet? <br></br>Have a look at the whiteboard, chatbox, and live audio calls work!</p>
                    <div className = "wrapper wrapper-form">
                        <Button id = "wb" onClick={testRun} 
                        style={{ color: "white", backgroundColor: '#1a237e' }}>Whiteboard
                        </Button>
                        <Button id = "chat" onClick={testRun} 
                        style={{ color: "white", backgroundColor: '#1a237e' }}>Chatroom
                        </Button>
                        <Button id = "call" onClick={testRun} 
                        style={{ color: "white", backgroundColor: '#1a237e' }}>Call
                        </Button>
                    </div>
                </div>
            </div>
            <div className = 'container'>
                <div className = 'card-block'>
                    <div className= 'logo-container'>
                        <img className = 'icon-logo' src ="" alt='logo'></img>
                    </div>
                    <hr className = 'hr-line'></hr>
                    <div className = 'wrapper'>
                        <p className = 'welcome-text'>Welcome to Cloud LearnX</p>
                    </div>
                    <form onSubmit={(e)=>{e.preventDefault();}}>
                        <div className="wrapper wrapper-form">
                            {/* <label  className="form-label">Username</label> */}
                            <AccountCircleIcon className = 'form-icon' style={{ fontSize: 30 }}/>
                            <input onChange={ (e) => {
                                setLoginData({
                                    ...loginData, email : e.target.value
                                });}
                            } type="text" className="form-control" id="exampleFormControlInput1" placeholder="david@gmail.com" />
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
        </div>
    );
    }
    else{
        return(
            <div>
                 <Button onClick={logOut}>LogOut</Button>
                 <Home
                    role = {logged.role}
                    userId = {logged.UserId}
                    feature = {logged.feature}
                />
            </div>
            
           
        )
    }
}

export default Login;
