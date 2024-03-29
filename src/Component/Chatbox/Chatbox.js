import React, { useEffect, useState , useRef } from 'react';
import './Chatbox.css';
import Button from '@material-ui/core/Button';
import {db} from '../Firebase/firebase'
import { doc, getDoc } from "firebase/firestore"; 


/*
 Flow Chart
  1-Fill form  msg
  2-send message how to work
    1- If Login success send message localstorage
    ** messgae senderId = reciverId = password or email name one 
    2- same time message sending (one to one)
    3-firestore
   3-read message
   4-delete message 
*/
const Chatbox = (props) => {
    const [messageArray, setMessageArray] = useState([]);
    const socket = useRef(props.socket);

    useEffect(()=> {
        if(messageArray.length !== 0){
            // document.getElementsByClassName('irc-message').lastChild.scrollIntoView({ behavior: "smooth" });
            document.getElementsByClassName('irc-message')[messageArray.length].scrollIntoView({behavior: 'smooth'})
        }
        
    }, [messageArray])

    useEffect(async () => {
        // socket.current = io("http://localhost:5000",{ withCredentials: true, extraHeaders: { "my-custom-header": "abcd" }  });
        //we are importing socket from property in classroom
        //restoring previous message upon refresh by checking if old messages are there
        const docRef = doc(db, "Sessions", props.sessionId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            if(docSnap.data().Messages){
                setMessageArray(docSnap.data().Messages)
            }
          } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
          }
    },[]);


    const chatlist = messageArray.map((item, index) => {
            return (
                <span className='irc-message message-highlight' style = {{'font-size' : '18px'}} key={index}>
                    <div className = 'irc-time'>{item.time}</div>
                            {item.sender} : {item.message}
                </span>
            );
      });

    const catchMessage = () => {
        socket.current.on('chat-message', (res) => {
             inputMsg(res,false) 
            //  setMessageArray([...messageArray, res]);
        });
    }

    function inputMsg(msg, emit){
        setMessageArray([...messageArray, msg])
        if(emit){
            socket.current.emit('chat-message', {
                'message': msg.message,
                'sender': props.username,
                'time': msg.time
            });
        }
        else{
            return;
        }
    }

    function sendMessage(event, type) {
        let msg = {};
        if(type === 'key'){
            if(event.key === 'Enter'){
                msg.message = event.target.value;
                event.target.value = null;
            }
        }
        else if(type === 'button'){
            let txt = document.getElementById('irc-Entrybox')
            msg.message = txt.value;
        }
        else{
            return;
        }
        if(msg.message){
            msg.sender = props.username.split(' ')[0];
            // msg.time = 
            inputMsg(msg, true)
        }
    
 }

 catchMessage();


    return (
        <div id = "helper-section">
            <div id="irc-section">
                <div id = 'irc-message-container'>
                    <span className = 'irc-message'>Welcome to your session!</span>
                        {chatlist}
                </div>
                <input 
                        id="irc-Entrybox"
                        onKeyPress={(e) => {sendMessage(e,'key')}} 
                        placeholder="Enter your message here..."
                />
                <Button id = "irc-sendButton" variant="contained" style = {{'margin' : '0 auto', 'width': '100px'}} onClick={(e) => {sendMessage(e, 'button')}}>
                    Send
                </Button>
            </div>
        </div>
    );
};





export default Chatbox;