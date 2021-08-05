import {React,useEffect, useState} from 'react'
import AudioBridge from '../Tutors/AudioBridge'
import Whiteboard from '../Whiteboard/Whiteboard';
import WhiteboardStudent from '../Whiteboard/WhiteboardStudent';
import StudentAudioBridge from '../Students/AudioBridge'
import db from '../Firebase/firebase.js'
import LinearProgress from '@material-ui/core/LinearProgress'
import io from 'socket.io-client';

function Classroom(props) {
    const [socket, setSocket] = useState()
    const [slides, setSlides] = useState([])
    
    useEffect(()=>{
        setSocket(io('http://localhost:5000'))
        if(props.role === 'tutor'){
                console.log(props.lessons) // all the titles
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
            //initiating array for annotations
            lessons.forEach(item => {
                db.collection("Sessions").doc(`${props.sessionId}`).update({
                    [item]: {}
                });
            });
        }
        
    }, [])
    // const username = localStorage.getItem('username');
    // const sessionId = localStorage.getItem('sessionId');
    // const role = localStorage.getItem('role');

    const username = props.username;
    const sessionId = props.sessionId;
    const role = props.role;
    
    console.log(`You are ${username} and you have started session ${sessionId}`)
    if(role === "tutor" && socket !== undefined && slides.length === props.lessons.length){
        console.log(slides, typeof(slides), slides.length);
        return (
            <div>
                {/* <AudioBridge 
                username = {username}
                sessionId = {sessionId}/> */}
                <Whiteboard
                sessionId = {sessionId}
                lessonSlides = {slides}
                lessonTitles = {props.lessons}
                socket = {socket}/>
            </div>
        )
    }
    else if(role === "student" && socket !== undefined){
        return(
            <div>
                {/* <StudentAudioBridge
                username = {username}
                sessionId = {sessionId}/> */}
                <WhiteboardStudent
                sessionId = {sessionId}
                socket = {socket}/>
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
