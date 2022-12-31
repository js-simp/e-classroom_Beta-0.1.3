import {React, useEffect, useState} from 'react'
import db from '../Firebase/firebase.js'
import Sessions from './Sessions'
import './Home.css'
import Classroom from '../Classroom/Classroom.js';

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
    const [sessionsInfo, setSessionsInfo] = useState([]);
    const [launched, setLaunched] = useState();

    const userId = props.user;
    useEffect(() => {
        let docRef = db.collection("Students").doc(`${userId}`);

        docRef.get().then((doc) => {
            if (doc.exists) {
                // console.log("Document data:", doc.data().Info);
                const info = doc.data().Info;
                setName(info.Name);
                setSchoolId(info.SchoolId);
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });

        let sessRef = db.collection("Sessions").where("StudentId", "==", `${userId}`);
            //query the sessions that are on that particular day
            let sessionInfo = [];
            sessRef.get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    // console.log(doc.id, " => ", doc.data());
                    sessionInfo.push(doc)
                })
                setSessionsInfo(sessionInfo);
            }).catch((error) => {
                console.log("Error getting document:", error);
            });

    },[])

    // console.log(sessionsInfo.StudentId)
    if(sessionsInfo.length !== 0 && name !== '' && launched === undefined){
        return (
            <div id = "session-card">
                <h1 id="tutor-name">Hi {name}</h1>
                {sessionsInfo.map( session => (
                    <Sessions
                    username = {name}
                    SchoolId = {schoolId}
                    Date = {session.data().Date}
                    Time = {session.data().Time}
                    setLaunched = {setLaunched}
                    SessionId = {session.id}
                    StudentId = {session.data().StudentId} 
                    />
                ))
                }
            </div>
            
        )
    }

    else if(sessionsInfo.length === 0 && name !== '' && launched === undefined){
        return(
            <div id = "session-card">
                <h1 id = 'tutor-name'>Hi {name}</h1>
            <h2 id = "no-session-notification">No sessions booked for today</h2>
            </div>
        )
    }

    else if(launched !== undefined){
        return(
            <Classroom
            sessionId = {launched.sessionId}
            username = {name}
            role = 'student'
        />
        )
    }    
    else{
        return(
            <div id = "session-card">
                <h1 id="student-name">Hi {name}</h1>
            </div>
        )
    }
    
}

export default Home