import {React, useEffect, useState} from 'react'
import db from '../Firebase/firebase.js'
import Sessions from './Sessions'
import './Home.css'
import Classroom from '../Classroom/Classroom.js';

// the props for Sesssions component:
// props.Name : students name
// props.StudentId : students id
// props.SchoolId : School Id
// props.Year : Students school year
// props.Lessons: Lesson array (length 3)
// props.Time : Time the session is booked for
// ;

function Home(props) {
    const [name, setName] = useState('');
    const [sessionsInfo, setSessionsInfo] = useState();
    const userId = props.user;
    const [launched, setLaunched] = useState();
    
    useEffect(() => {
        let docRef = db.collection("Tutors").doc(`${userId}`);

        docRef.get().then((doc) => {
            if (doc.exists) {
                // console.log("Document data:", doc.data().Info);
                const info = doc.data().Info;
                console.log("Sessions:", info.Sessions[0])
                setSessionsInfo(info.Sessions)
                setName(info.Name);
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });

    }, [])

    // console.log(sessionsInfo.StudentId)
    if(sessionsInfo != undefined && name !== '' && launched === undefined){
        return (
            <div id = "session-card">
                <h1 id="tutor-name">Hi {name}</h1>
                {sessionsInfo.map( session => (
                    <Sessions 
                    Name = "helen"
                    username = {name}
                    StudentId = {session.StudentId} 
                    SchoolId = {session.SchoolId}
                    SessionId = {session.SessionId}
                    setLaunched = {setLaunched}
                    Year = "Y4" 
                    Lessons = {session.Lesson} 
                    Time = {session.Time} />
                ))
                }
            </div>
            
        )
    }
    else if(launched !== undefined){
        return(
            <Classroom
            sessionId = {launched.sessionId}
            schoolId = {launched.schoolId}
            lessons = {launched.lessons}
            username = {launched.username}
            role = 'tutor'
        />
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