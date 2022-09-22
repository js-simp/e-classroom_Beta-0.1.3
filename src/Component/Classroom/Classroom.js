import {React,useEffect, useState} from 'react'
import AudioBridge from '../AudioBridge/AudioBridge'
import Whiteboard from '../Whiteboard/Whiteboard';
import WhiteboardStudent from '../Whiteboard/WhiteboardStudent';
import db from '../Firebase/firebase.js'
import firebase from 'firebase';
import LinearProgress from '@material-ui/core/LinearProgress'
import io from 'socket.io-client';
import Chatbox from '../Chatbox/Chatbox';
import './Classroom.css'

function Classroom(props) {
    const [socket, setSocket] = useState()
    const [slides, setSlides] = useState([])
    
    useEffect(()=>{
        // setSocket(io('http://localhost:5000'))
        // setSocket(io('https://bcend.herokuapp.com'))
        setSocket(io(process.env.REACT_APP_SOCKET_SERVER))
        if(props.role === 'tutor'){
            let LessonSlides = []
            let lessons = props.lessons;
            lessons.forEach(item => {
                let docRef = db.collection("Lessons").doc(`${item}`);
                docRef.get().then((doc) => {
                    if (doc.exists) {
                        // console.log("Document data:", doc.data().Slides[0]);
                        const slidesArr = doc.data().Slides;
                        // console.log("Sessions:", slidesArr)
                        LessonSlides.push(slidesArr);
                        if(LessonSlides.length === props.lessons.length){
                            setSlides(LessonSlides)
                        }
                        // console.log(LessonSlides);
                    } else {
                        // doc.data() will be undefined in this case
                        console.log("No such document!");
                    }
                }).catch((error) => {
                    console.log("Error getting document:", error);
                });
            });

            //Getting the sessions doc, and checking whether annotations are available
            db.collection('Sessions').get(`${props.sessionId}`).then((docSnapshot) => {
                if (docSnapshot.exists) {
                    console.log(docSnapshot);
                } else {
                    console.log("Session not launched before!");
                    //initiating array for annotations
                    lessons.forEach(item => {
                        db.collection("Sessions").doc(`${props.sessionId}`).update({
                            [item]: {}
                        });
                    });
                    //adding session to launched
                    const res = db.collection('Launched').doc(`${props.sessionId}`).set({
                        Launched: true,
                      });
                }
            }).catch(function(error) {
                console.log("Error getting document:", error);
            });
            
        }
        
    },[])

    const username = props.username;
    const sessionId = props.sessionId;
    const role = props.role;
    const studentId = props.studentId;

    if(role === "tutor" && socket !== undefined && slides.length === props.lessons.length){
        return (
            <div>
                <AudioBridge 
                username = {username}
                sessionId = {sessionId}
                studentId = {studentId}
                role = {role}/>
                <div className = 'interaction-area'>
                    <div className = 'chatbox'>
                    <Chatbox
                        username = {username}
                        sessionId = {sessionId}
                        socket = {socket}/>
                    </div> 
                    <div className = 'whiteboard'>
                        <Whiteboard
                        sessionId = {sessionId}
                        username = {username}
                        lessonSlides = {slides}
                        lessonTitles = {props.lessons}
                        socket = {socket}/>
                    </div>
                </div>
            </div>
        )
    }
    else if(role === "student" && socket !== undefined){
        return(
            <div>
                <AudioBridge
                username = {username}
                sessionId = {sessionId}
                studentId = {studentId}
                role = {role}/>
                <div className = 'interaction-area'>
                    <div className = 'chatbox'>
                        <Chatbox
                            username = {username}
                            sessionId = {sessionId}
                            socket = {socket}/>
                    </div>
                    <div className = 'whiteboard'>
                        <WhiteboardStudent
                        username = {username}
                        sessionId = {sessionId}
                        socket = {socket}/>
                    </div>
                </div>
            </div>
        )
    }
    else{
        return(
            <div>
                <LinearProgress />
            </div>
        )
    }
    
}

export default Classroom
