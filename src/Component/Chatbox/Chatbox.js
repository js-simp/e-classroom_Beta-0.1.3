import React, { useEffect, useState , useRef } from 'react';
import './Chatbox.css';
import io from 'socket.io-client';

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
const Chatbox = () => {
    const [msg,setMsg] = useState("");
    const [status, setStatus] = useState("");
    const [messageArray, setMessageArray] = useState([]);
    const [count, setCount] = useState(0);
    const [docId, setDocId] = useState(0);
    const socket = useRef();

    useEffect(() => {
        socket.current = io("http://localhost:5000",{ withCredentials: true, extraHeaders: { "my-custom-header": "abcd" }  }); 
    }, [count]);

    const chatlist = messageArray.map((item, index) => {
        if (!item.sender) {
            return (
                <li className="row" key={index}>
                    <div>
                        <div key={index} style={{ float: "left", padding: "5px" }}>
                            <p style={{ borderRadius: "10px", padding: "5px", backgroundColor: "black", color: "white", fontWeight: "bolder" }}>{item.message}</p>
                            <p style={{ color: "red", fontWeight: "200", fontSize: "10px" }}>{"from : " + item.sender}</p>
                            <p style={{ color: "black", fontWeight: "200" }}>
                                <span style={{ color: "black", fontWeight: "bolder", fontSize: "8px" }}>
                                    {item.date + "   "}</span>
                                <span style={{ color: "black", fontWeight: "bolder" }}>
                                    {item.time}</span></p>
                        </div>
                    </div>
                </li>
            );
        }
      });

    

    const readMessage = () => {
        socket.current.on('chat-message', (res) => {
            console.log(res); var x = []; x.push(res);
             setMessageArray(...x); console.log(messageArray)
        });
    }
    const sendMessage =  () => {
        var d = new Date();
        var time = d.getHours() + " : " + d.getMinutes() + " : " + d.getSeconds();
        var date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        var senderId = window.localStorage.getItem("userId");
        socket.current.emit('chat-message', {
        'message': msg,
        'time': time,
        'date': date,
        'sender': senderId,
        'reciver': "Teacher"
    });

    readMessage();
 }
    const getMsg = (e) => {setMsg(e.target.value);}

    return (
        <div style={{width:"320px", height:"auto" , border:"1px solid black" ,backgroundColor:"none", padding:"0px"}}>
            <div className="overflowCss ">
                <ul>
                    {chatlist}
                </ul>
            </div>
            <form 
            style={{width:"320px", height:"auto"}}
            onSubmit={(e) => { e.preventDefault(); }}>
                <div className="field">
                    <div className="control p-3">
                        <textarea onChange={getMsg} 
                         value={msg}
                         className="textarea is-small"
                         placeholder="Small textarea"
                         style={{
                             borderRadius:"20px",}}
                        />
                    </div>
                </div>
                <div
                 className="buttons"
                 style={{paddingLeft:"8%",paddingBottom:"10px"
                  }}>
                    <button onClick={() => {sendMessage("savindu"); }} className="button is-warning">
                        <p>Send {status}</p>
                    </button>
                  
                </div>
            </form>

        </div>
    );
};





export default Chatbox;