import {React,useEffect, useRef, useState , Component} from 'react'
import AudioBridge from '../Tutors/AudioBridge'
import Whiteboard from '../Whiteboard/Whiteboard';
import WhiteboardStudent from '../Whiteboard/WhiteboardStudent';
import StudentAudioBridge from '../Students/AudioBridge'
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
        setSocket(io('https://cloudlearnx-socket-server.herokuapp.com/'))
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
            //initiating array for annotations
            lessons.forEach(item => {
                db.collection("Sessions").doc(`${props.sessionId}`).update({
                    [item]: {}
                });
            });
        }
        
    },[])

    const username = props.username;
    const sessionId = props.sessionId;
    const role = props.role;
    const epoch = props.epoch;
    var today = Math.round((new Date()).getTime() / 1000);

    console.log(today);
    console.log(epoch);
    let final = today - epoch
    const final2 = final - (2*final)
    const final3 = Math.floor(final2/60);
                        
    console.log(final);
    console.log(final2);
    console.log(final3);

    const Ref = useRef(null);
    const [timer, setTimer] = useState('00:00:00');

    const getTimeRemaining = (e) => {
        const total = Date.parse(e) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        const hours = Math.floor((total / 1000 * 60 * 60) % 24);
        return {
            total, hours, minutes, seconds
        };
    }

    const startTimer = (e) => {
        let { total, hours, minutes, seconds } 
                    = getTimeRemaining(e);
        if (total >= 0) {
  
            setTimer(
                (hours > 9 ? hours : '0' + hours) + ':' +
                (minutes > 9 ? minutes : '0' + minutes) + ':'
                + (seconds > 9 ? seconds : '0' + seconds)
            )
        }
    }
  
  
    const clearTimer = (e) => {  
        setTimer(final2);

        if (Ref.current) clearInterval(Ref.current);
        const id = setInterval(() => {
            startTimer(e);
        }, 1000)
        Ref.current = id;
    }
  
    const getDeadTime = () => {
        let deadline = new Date();
        deadline.setSeconds(deadline.getSeconds() + final2);
        return deadline;
    }

    useEffect(() => {
        clearTimer(getDeadTime());
    }, []);

    {/*
    const [counter, setCounter] = useState(final2);

    useEffect(() => {
        counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
      }, [counter]);
    */}  
    
    if(role === "tutor" && socket !== undefined && slides.length === props.lessons.length){
        return (
            <div>
                <AudioBridge   
                username = {username}
                sessionId = {sessionId}/>
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
                    
                    <h1>{timer}</h1>
                </div>
            </div>
        )
    }
    else if(role === "student" && socket !== undefined){
        return(
            <div>
                <StudentAudioBridge
                username = {username}
                sessionId = {sessionId}/>
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
