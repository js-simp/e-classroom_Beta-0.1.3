import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox'
import AuthLogin from "./Authentication";


const Login = () => {
    const [type, setType] = useState("password");
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
        obj.userLoginFunction(username,password);
    }else{
        setErr("Error !");  
    }
    }

    return (
        <div>
            <form onSubmit={(e)=>{e.preventDefault();}}>
                <div className="mb-3">
                    <label  className="form-label">Email address</label>
                    <input onChange={ (e) => {
                        setLoginData({
                            ...loginData, user : e.target.value
                        });}
                    } type="text" className="form-control" id="exampleFormControlInput1" placeholder="Username" />
              <p style={{color:"red"}}>{err}</p>
                </div>
                <div className="mb-3 ">
                    <label  className="form-label">Password</label>
                    <input onChange={ (e) => {
                        setLoginData({
                            ...loginData, pass : e.target.value
                        });
                    }
                    }  type={type} className="form-control" id="inputPassword" />
                     <p style={{color:"red"}}>{err}</p>
                    <Checkbox onChange={showPassword}>show</Checkbox> 
                </div>
                <Button onClick={submitBtn} type="submit" style={{ color: "white", backgroundColor: "black" }} >Login</Button>
            </form>
        </div>
    );
}

export default Login;
