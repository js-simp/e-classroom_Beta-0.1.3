import {React,useEffect} from 'react';
import db from '../Firebase/firebase.js';

function LiveSessions() {

    //colllect information about ongoing sessions
    // useEffect(() => {
    //     let tutorCollection = db.collection("Tutors");
    //     //query the sessions that are on that particular day
    //     let query = tutorCollection.where("Sessions", "array-contains", )
    //     docRef.get().then((doc) => {
    //         if (doc.exists) {
    //             // console.log("Document data:", doc.data().Info);
    //             const info = doc.data().Info;
    //             setSessionsInfo(info.Sessions)
    //             setName(info.Name);
    //         } else {
    //             // doc.data() will be undefined in this case
    //             console.log("No such document!");
    //         }
    //     }).catch((error) => {
    //         console.log("Error getting document:", error);
    //     });

    // },[])

  return (
    <div>LiveSessions</div>
  )
}

export default LiveSessions