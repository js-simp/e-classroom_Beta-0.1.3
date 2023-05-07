import axios from 'axios'
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
import {auth, functions} from '../Firebase/firebase';

export default class Authentication {
    //Compare credetials from Mongodb 
    //Login into classroom

    /*   Flow of Authentication
          1- If true  login redirect to session page -- false redirect to login
    */
userLoginFunction(email, password) {
  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    console.log(user.email);
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage);
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
  const createUser = httpsCallable(functions, 'createUser');
  const userData = {
      uid: regInfo.id,
      email: regInfo.email,
      emailVerified: false,
      password: regInfo.pass,
      displayName: regInfo.user,
      disabled: false,
    
  }
    createUser(userData)
    .then((user) => {
      console.log(user.email);
      // add the role student/tutor to the user
      const addRole = httpsCallable(functions, 'addRole');
      addRole({ email : regInfo.email, role: regInfo.role })
        .then((result) => {
          // Read result of the Cloud Function.
          /** @type {any} */
          console.log(result);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorMessage);
          // ..
        });
    })
    .catch((error) => {
      console.log(error.message)
    })
  
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



