import { responsiveFontSizes } from '@material-ui/core';
import axios from 'axios'
import db from "../Firebase/firebase";

export default class Authentication {
    //Compare credetials from firebase firestore
    //Login into classroom

    /*   Flow of Authentication
          1- If true  login redirect to session page -- false redirect to login
    */

    //Login
//     async userLoginFunction(userName,userPassword, setLogged) {

//         try{
//         var docRef = await db.collection("Logins").doc(`${userName}`);
//         docRef
//           .get()
//           .then((doc) => {
//             if (doc.exists) {
//               const d = doc.data(); //json array data read
//             //   console.log(d);
//             //console.log("Login data",d[id].password);//get specific values by search
//              if(d.password === userPassword){
//                  alert("Login Success");
//                  setLogged({'loggedIn': true, 'role' : d.role, 'UserId' : d.Id })
//                  window.sessionStorage.setItem("UserId",d.Id);
//                  window.sessionStorage.setItem("role", d.role);
//              }else{
//                 alert("Login Failed");
//              }
           
//             } else {
//               // doc.data() will be undefined in this case
//               console.log("No such document!");
//             }
//           })
//           .catch((error) => {
//             console.log("Error getting document:", error);
//           });
//         }catch(e){
//             console.log(e);
//         }
//     }  

userLoginFunction(username, password, logInStatus, setUser) {
  console.log(username, password)
  axios({
    method: 'post',
    url: 'http://localhost:5000/login',
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

userGetFunction(logInStatus, setUser) {
  axios({
    method : 'get',
    url : 'http://localhost:5000/getuser',
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
    url : 'http://localhost:5000/logout',
    withCredentials : true
  })
  .then(function (response){
    console.log('Successfully logged out');
    logInStatus({'loggedIn' : false});
    window.location.reload()
  })
}

}



