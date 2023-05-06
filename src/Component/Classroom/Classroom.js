import {React,useEffect, useState} from 'react'
import AudioBridge from '../AudioBridge/AudioBridge'
import Whiteboard from '../Whiteboard/Whiteboard';
import {db} from '../Firebase/firebase.js';
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore"; 
import LinearProgress from '@material-ui/core/LinearProgress'
import io from 'socket.io-client';
import Chatbox from '../Chatbox/Chatbox';
import './Classroom.css'
import { LocalAtmRounded } from '@material-ui/icons';

function Classroom(props) {
    const [socket, setSocket] = useState()
    const [slides, setSlides] = useState([])
    const [loaded , setLoaded] = useState(false);
    
    useEffect(async ()=>{
        // setSocket(io('http://localhost:5000'))
        // setSocket(io('https://bcend.herokuapp.com'))
        setSocket(io(process.env.REACT_APP_SOCKET_SERVER))
        if(props.role === 'tutor'){
            let LessonSlides = []
            let lessons = props.lessons;
            for(const item of lessons){
                const docRef = doc(db, "Lessons", `${item}`);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    // console.log("Document data:", docSnap.data().Slides[0]);
                    const slidesArr = docSnap.data().Slides;
                        // console.log("Sessions:", slidesArr)
                        LessonSlides.push(slidesArr);
                        if(LessonSlides.length === props.lessons.length){
                            setSlides(LessonSlides)
                            setLoaded(true)
                        }
                  } else {
                    // docSnap.data() will be undefined in this case
                    console.log("No such document!");
                  }
            }

            //Getting the sessions doc, and checking whether annotations are available
            const docLaunched = doc(db, "Launched", `${props.sessionId}`);
            const docSnapshot = await getDoc(docLaunched);
            if (docSnapshot.exists) {
                console.log(docSnapshot);
            } else {
                console.log("Session not launched before!");
                //initiating array for annotations
                for(item of lessons) {
                    const AnnotationsRef = doc(db, "Annotations", `${props.sessionId}`);
                    await updateDoc(AnnotationsRef, {
                        [item]: {}
                      });
                }
                //adding session to launched
                await setDoc(doc(db, "Launched", `${props.sessionId}`), {
                    Launched: true,
                  });
            }
            
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
