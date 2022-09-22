import {React,useEffect, useState} from 'react'
import AudioBridge from '../AudioBridge/AudioBridge'
import Whiteboard from '../Whiteboard/Whiteboard';
import db from '../Firebase/firebase.js'
import firebase from 'firebase';
import LinearProgress from '@material-ui/core/LinearProgress'
import io from 'socket.io-client';
import Chatbox from '../Chatbox/Chatbox';
import './Classroom.css'
import { LocalAtmRounded } from '@material-ui/icons';

function Classroom(props) {
    const [socket, setSocket] = useState()
    const [slides, setSlides] = useState([])
    const [loaded , setLoaded] = useState(false);
    
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
                            setLoaded(true)
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
            db.collection('Launched').doc(`${props.sessionId}`).get().then((docSnapshot) => {
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
        else {
            setLoaded(true);
        }
        
    },[])

    const username = props.username;
    const sessionId = props.sessionId;
    const role = props.role;
    const studentId = props.studentId;

    if(socket !== undefined && loaded){
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
                        role = {role}
                        username = {username}
                        sessionId = {sessionId}
                        socket = {socket}
                        lessonSlides = {role === "tutor" ? slides : undefined}
                        lessonTitles = {role === "tutor" ? props.lessons : undefined}/>
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
