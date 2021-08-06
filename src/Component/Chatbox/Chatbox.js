import React, { useEffect, useState , useRef } from 'react';
import './Chatbox.css';
import db from '../Firebase/firebase'


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

    useEffect(() => {
        // socket.current = io("http://localhost:5000",{ withCredentials: true, extraHeaders: { "my-custom-header": "abcd" }  });
        //we are importing socket from property in classroom

        //restoring previous message upon refresh by checking if old messages are there
        let docRef = db.collection("Sessions").doc(props.sessionId);
                docRef.get().then((doc) => {
                    //if there is a messages doc created then retrieve the messages history
                    if (doc.exists) {
                        if(doc.data().Messages){
                            setMessageArray(doc.data().Messages)
                        };
                    } else {
                        // doc.data() will be undefined in this case
                        console.log("No such document!");
                    }
                }).catch((error) => {
                    console.log("Error getting document:", error);
                });
    }, []);

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

    const chatlist = messageArray.map((item, index) => {
            return (
                <li className='irc-message message-highlight' key={index}>
                    <div>
                        <div style={{ float: "left", padding: "5px" }}>
                            <p>{item.message}</p>
                            <p>{"from : " + item.sender}</p>
                            <span>{item.time}</span>
                        </div>
                    </div>
                </li>
            );
      });

    const catchMessage = () => {
        socket.current.on('chat-message', (res) => {
            console.log(res); var x = []; x.push(res);
             inputMsg(res,false) 
            //  setMessageArray([...messageArray, res]);
        });
    }

    function sendMessage(event, type) {
        let msg = {};
        if(type === 'key'){
            if(event.key === 'Enter'){
                console.log(event.target.value)
                msg.message = event.target.value;
            }
        }
        else if(type === 'button'){
            let txt = document.getElementById('irc-Entrybox')
            console.log(txt.value);
            msg.message = txt.value;
        }
        else{
            return;
        }
        if(msg.message){
            msg.sender = props.username;
            msg.time = 
            inputMsg(msg, true)
        }
    
 }

 catchMessage();


    return (
        <div id = "helper-section">
            <div id="irc-section">
                <ul>
                    <li className = 'irc-message'>Welcome to your session!</li>
                    {chatlist}
                </ul>
                <textarea 
                        id="irc-Entrybox"
                        onKeyPress={(e) => {sendMessage(e,'key')}} 
                        placeholder="Enter your message here..."
                />
                <button id = "irc-sendButton" onClick={(e) => {sendMessage(e, 'button')}}>
                    Send
                </button>
            </div>
        </div>
    );
};





export default Chatbox;