import {React, useEffect, useState} from 'react'
import db from '../Firebase/firebase.js'
import Sessions from './Sessions'
import './Home.css'

// the props for Sesssions component:
// 
// props.SchoolId : School Id
// props.Date : Date of the session being booked
// props.Time : Time the session is booked for
//props.SessionId : Session Id
// ;

function Home(props) {
    const [name, setName] = useState('');
    const [schoolId, setSchoolId] = useState('')
    const [sessionsInfo, setSessionsInfo] = useState();
    const userId = props.user;
    useEffect(() => {
        let docRef = db.collection("Students").doc(`${userId}`);

        docRef.get().then((doc) => {
            if (doc.exists) {
                // console.log("Document data:", doc.data().Info);
                const info = doc.data().Info;
                setSessionsInfo(info.Sessions)
                setName(info.Name);
                setSchoolId(info.SchoolId);
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });

    }, [])

    // console.log(sessionsInfo.StudentId)
    if(sessionsInfo != undefined && name !== ''){
        return (
            <div id = "session-card">
                <h1 id="tutor-name">Hi {name}</h1>
                {sessionsInfo.map( session => (
                    <Sessions
                    username = {name}
                    SchoolId = {schoolId}
                    Date = {session.Date}
                    Time = {session.Time}
                    SessionId = {session.SessionId} />
                ))
                }
            </div>
            
        )
    }
    else{
        return(
            <div id = "session-card">
                <h1 id="tutor-name">Hi {name}</h1>
            </div>
        )
    }
    
}

export default Home