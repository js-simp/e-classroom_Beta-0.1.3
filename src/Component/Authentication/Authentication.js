import axios from 'axios'
import {createUserWithEmailAndPassword } from "firebase/auth";
import {auth} from '../Firebase/firebase';

export default class Authentication {
    //Compare credetials from Mongodb 
    //Login into classroom

    /*   Flow of Authentication
          1- If true  login redirect to session page -- false redirect to login
    */
userLoginFunction(username, password, logInStatus, setUser) {
  console.log(username, password)
  axios({
    method: 'post',
    url: `${process.env.REACT_APP_AUTH_SERVER}/login`,
    data: {
      username: username,
      password: password
    },
    withCredentials: true
  })
    .then(function (response) {
      console.log(response)
      alert(response.data.message)
      //set logInStatus hook in App.js to true and render Summary page
      if(response.data.success){
        // props.logInStatus(true)
        logInStatus({'loggedIn': true, 'role' : response.data.role, 'UserId' : response.data.userId})
        setUser(username)
      }
    });
}

userCreationFunction(regInfo) {
  //available data
  /*
  username : regInfo.user
  password : regInfo.pass
  role : regInfo.role
  id : regInfo.id,
  email : regInfo.email
  */
  createUserWithEmailAndPassword(auth, regInfo.email, regInfo.pass)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage);
    // ..
  });
}

userGetFunction(logInStatus, setUser) {
  axios({
    method : 'get',
    url : `${process.env.REACT_APP_AUTH_SERVER}/getuser`,
    withCredentials: true
  })
    .then(function (response){
      if(response.data){
        console.log(response.data);
      logInStatus({'loggedIn' : true, 'role' : response.data.role, 'UserId' : response.data.userId})
      setUser(response.data.username)
      }
      else{
      logInStatus({'loggedIn' : false})
      }
    })
}

userLogoutFunction(logInStatus) {
  axios({
    method : 'post',
    url : `${process.env.REACT_APP_AUTH_SERVER}/logout`,
    withCredentials : true
  })
  .then(function (response){
    console.log('Successfully logged out');
    logInStatus({'loggedIn' : false});
    window.location.reload()
  })
}

}



