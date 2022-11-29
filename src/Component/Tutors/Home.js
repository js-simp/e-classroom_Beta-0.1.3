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
        let newRef = db.collection("Tutors").doc(`${userId}`);
        newRef.get().then((doc) => {
            if (doc.exists) {
                // console.log("Document data:", doc.data());
                setName(doc.data().Info.Name)
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
        
        let docRef = db.collection("Sessions").where("TutorId", "==", `${userId}`);
        //query the sessions that are on that particular day
        let sessionInfo = [];
        docRef.get().then((querySnapshot) => {
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
    if(sessionsInfo !== undefined && name !== '' && launched === undefined){
        return (
            <div id = "session-card">
                <h1 id="tutor-name">Hi {name}</h1>
                {sessionsInfo.map( session => (
                    <Sessions 
                    setLaunched = {setLaunched}
                    StudentId = {session.data().StudentId}
                    Lessons = {session.data().Lessons}
                    epoch = {session.data().epochTime}
                    SessionId = {session.id}
                    Time = {session.data().Time} 
                    //-----------all student details below are obtained from Sessions.js using the StudentId-------------  
                    // SchoolId = {session.SchoolId}
                    // Name = {session.StudentName}
                    // Year = "Y4" 
                    
                    />
                ))
                }
            </div> 
        )
    }
    else if(launched !== undefined){
        return(
            <Classroom
            sessionId = {launched.sessionId}
            studentId = {launched.studentId}
            lessons = {launched.lessons}
            username = {name}
            epoch = {launched.startTime}
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