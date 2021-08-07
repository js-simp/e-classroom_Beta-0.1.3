
import db from "../Firebase/firebase";

export default class Authentication {
    //Compare credetials from firebase firestore
    //Login into classroom

    /*   Flow of Authentication
          1- If true  login redirect to session page -- false redirect to login
    */

    //Login
    async userLoginFunction(userName,userPassword, setLogged) {
      //  console.log(userName,userPassword);

        try{
        var docRef = await db.collection("Logins").doc(`${userName}`);
        docRef
          .get()
          .then((doc) => {
            if (doc.exists) {
              const d = doc.data(); //json array data read
            //   console.log(d);
            //console.log("Login data",d[id].password);//get specific values by search
             if(d.password === userPassword){
                 alert("Login Success");
                 setLogged({'loggedIn': true, 'role' : d.role, 'UserId' : d.Id })
                 window.sessionStorage.setItem("UserId",d.Id);
                 window.sessionStorage.setItem("role", d.role);
             }else{
                alert("Login Failed");
             }
           
            } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
            }
          })
          .catch((error) => {
            console.log("Error getting document:", error);
          });
        }catch(e){
            console.log(e);
        }
    }  

}
