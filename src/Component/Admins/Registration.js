import {React, useState, useEffect} from 'react'
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox'
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { EmailRounded } from '@material-ui/icons';
import LockIcon from '@material-ui/icons/Lock';
import { CardMembership } from '@material-ui/icons';
import { Select, MenuItem } from '@material-ui/core';
import AuthLogin from "../Authentication/Authentication";

function Registration() {
    const [type, setType] = useState("password");
    const [err, setErr] = useState("");
    const [userData, setUserData] = useState({
        user :"",
        pass:"",
        email:"",
        role: "",
        id: ""
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
        let lenUser = userData.user.length;
        let lenPass = userData.pass.length;
        let username =  userData.user;
        let password = userData.pass;
        if(lenUser !== 0 && lenPass!== 0)
        { 
        let obj =  new  AuthLogin();
        obj.userLoginFunction(username,password, setLogged, setUser);
    }else{
        setErr("Error !");  
    }
    }

    return (
        <div className = 'registration-form-container'>
            <form className = 'registration-form' onSubmit={(e)=>{e.preventDefault();}}>
                <div className="wrapper wrapper-form">
                    <AccountCircleIcon className = 'form-icon' style={{ fontSize: 30 }}/>
                    <input onChange={ (e) => {
                        setUserData({
                            ...userData, user : e.target.value
                         });}
                    } type="text" className="form-control" id="exampleFormControlInput1" placeholder="Username" />
                <p style={{color:"red"}}>{err}</p>
                </div>
                <div className="wrapper wrapper-form">
                    <EmailRounded className = 'form-icon' style={{ fontSize: 30 }}/>
                    <input onChange={ (e) => {
                        setUserData({
                            ...userData, email : e.target.value
                         });}
                    } type="text" className="form-control" id="exampleFormControlInput1" placeholder="Email" />
                <p style={{color:"red"}}>{err}</p>
                </div>
                <div className = "wrapper wrapper-form" >
                <CardMembership className = 'form-icon' style={{ fontSize: 30 }}/>
                <Select
                    className="form-control"
                    style = {{width : "50%"}}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={userData.role}
                    label="Role"
                    onChange={(e)=> {
                        setUserData({
                        ...userData, role : e.target.value
                    })}
                    }
                    >
                    <MenuItem value={"Student"}>Student</MenuItem>
                    <MenuItem value={"Tutor"}>Tutor</MenuItem>
                </Select>
                </div>
                <div className="wrapper wrapper-form">
                    {/* <label  className="form-label">Password</label> */}
                    <LockIcon className = 'form-icon' style={{ fontSize: 30 }}/>
                    <input onChange={ (e) => {
                        setUserData({
                            ...userData, pass : e.target.value
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
    );
}

export default Registration