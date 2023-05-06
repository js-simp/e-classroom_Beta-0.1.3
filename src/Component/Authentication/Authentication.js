import axios from 'axios'
import {createUserWithEmailAndPassword } from "firebase/auth";
import {auth} from '../Firebase/firebase';

export default class Authentication {
    //Compare credetials from Mongodb 
    //Login into classroom

    /*   Flow of Authentication
          1- If true  login redirect to session page -- false redirect to login
    */
userLoginFunction(email, password, logInStatus, setUser) {
  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    logInStatus({'loggedIn': true, 'role' : user.role, 'UserId' : user.uid})
        setUser(user.email)
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
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
  signOut(auth).then(() => {
    // Sign-out successful.
    logInStatus({'loggedIn' : false});
    window.location.reload()
  }).catch((error) => {
    // An error happened.
  });
}

}



