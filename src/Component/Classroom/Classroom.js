import {React,useEffect, useState} from 'react'
import AudioBridge from '../Tutors/AudioBridge'
import Whiteboard from '../Whiteboard/Whiteboard';
import WhiteboardStudent from '../Whiteboard/WhiteboardStudent';
import StudentAudioBridge from '../Students/AudioBridge'
import LinearProgress from '@material-ui/core/LinearProgress'
import io from 'socket.io-client';

function Classroom(props) {
    const [socket, setSocket] = useState()
    useEffect(()=>{

        setSocket(io('http://localhost:5000'))
    }, [])
    const username = localStorage.getItem('username');
    const sessionId = localStorage.getItem('sessionId');
    const role = localStorage.getItem('role');
    console.log(`You are ${username} and you have started session ${sessionId}`)
    if(role === "tutor" && socket !== undefined){
        return (
            <div>
                {/* <AudioBridge 
                username = {username}
                sessionId = {sessionId}/> */}
                <Whiteboard
                sessionId = {sessionId}
                socket = {socket}/>
            </div>
        )
    }
    else if(role === "student" && socket.current !== undefined){
        return(
            <div>
                <StudentAudioBridge
                username = {username}
                sessionId = {sessionId}/>
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
