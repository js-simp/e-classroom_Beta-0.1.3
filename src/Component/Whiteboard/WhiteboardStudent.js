import React, { useEffect, useRef, useState } from 'react';


import './Whiteboard.css';

const Whiteboard = (props) => {

  const [isDrawing, setIsDrawing] = useState(false);
  const [toolName, setToolName] = useState("pen");
  const [emogi, setEmogi] = useState("");
  const[color,setColor]= useState("");

  const [oldStartPoint, setOldStartPoint] = useState([0,0])
  const [keyStartPoint, setKeyStartPoint] = useState([0,0])

  const [inputBox, setInputBox] = useState("hidden")
  const [disableInput, setDisableInput] = useState("")

  // const socketRef = useRef(); using Reference from props
  const socketRef = useRef(props.socket);

  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const canvasRef2 = useRef(null);
  const contextRef2 = useRef(null);
  
  const canvasRef3 = useRef(null);
  const contextRef3 = useRef(null);



  useEffect(() => {

    //canvas define
    const canvas = canvasRef.current;
    canvas.width = 800;
    canvas.height = 600;
    canvas.style.width = "800px";
    canvas.style.height = "600px";

    const context = canvas.getContext("2d");
    //style the drawing point
    context.scale(1, 1);//pointer size
    context.lineCap = "round";//ponter shape
    context.strokeStyle = "black";//pointer coloer
    context.lineWidth = 5;//pointer width
    contextRef.current = context;

    //canvas 2 define for images
    const canvas2 = canvasRef2.current;
    canvas2.width = 800;
    canvas2.height = 600;
    canvas2.style.width = "800px";
    canvas2.style.height = "600px";

    const context2 = canvas2.getContext("2d");
    //style the drawing point
    context2.scale(1, 1);//pointer size
    contextRef2.current = context2;

    //canvas 3 define for images
    const canvas3 = canvasRef3.current;
    canvas3.width = 800;
    canvas3.height = 600;
    canvas3.style.width = "800px";
    canvas3.style.height = "600px";
    
    const context3 = canvas3.getContext("2d");
    //style the drawing point
    context3.scale(1, 1);//pointer size
    contextRef3.current = context3;

    // socketRef.current = io('http://localhost:5000');// initiating this in the classroom and passing via props
    socketRef.current.emit('join_room', props.sessionId);
    socketRef.current.on('drawing', onDrawingEvent);
    socketRef.current.on('text', onTextEvent);
    socketRef.current.on('image', onImageEvent);
  }, []);


useEffect(() => {
  if (toolName === "text") {
    
    current.x = keyStartPoint[0]
    current.y = keyStartPoint[1]
  }
}, [keyStartPoint])

 // ----------------------- socket.io connection ----------------------------
 const onDrawingEvent = (data) => {
  draw(data.x0, data.y0, data.x1, data.y1, data.toolName, data.color);
}

const onTextEvent = (data) => {
  type(data.x0, data.y0, data.text, data.color);
}

const onImageEvent = (data) => {
  // let image = document.createElement('img');
  // image.src = data.src;
  // contextRef2.current.drawImage(image, 0, 0, 800, 600)
  // contextRef.current.putImageData(data.annotation,0,0)
  console.log(data.src);
}
    
  const current = {
    color: 'black',
  };
  let drawing = false;
  let typing = false;
   // ------------------------------- create the drawing ----------------------------

 const draw = (x0, y0, x1, y1, toolName, color, emit) => {
   console.log(x0,y0,x1,y1)
  contextRef.current.globalCompositeOperation = "source-over";
  contextRef.current.beginPath();
  contextRef.current.strokeStyle = color;
  if (toolName === "pen") {
    contextRef.current.moveTo(x0, y0);
    contextRef.current.lineTo(x1, y1);
    contextRef.current.stroke();
    contextRef.current.closePath()
  } 
  else if (toolName === "eraser") {
    contextRef.current.clearRect(x1, y1, 20,20, Math.PI * 2, false);
  }
  else if (toolName === "rect"){
      contextRef.current.strokeRect(x0, y0, x1-x0, y1-y0);
      contextRef.current.closePath();
  }
  else if (toolName === "circle"){
    const a = (x1 - x0);
      const b = (y1 - y0)
      const length = (Math.sqrt((a * a) + (b * b)))
      const radius = length/2
      contextRef.current.arc((x0 + x1)/2, (y0 + y1)/2, radius,0, 2 * Math.PI);
      contextRef.current.stroke();
      contextRef.current.closePath()
  }
  else if (toolName === "line"){
      contextRef.current.moveTo(x0,y0)
      contextRef.current.lineTo(x1, y1);
      contextRef.current.stroke();
      contextRef.current.closePath();
  }
  if (!emit) { return; }

  socketRef.current.emit('drawing', {
    x0: x0,
    y0: y0,
    x1: x1,
    y1: y1,
    toolName,
    color,
  });
};
// ------------------------------- create the text ----------------------------
const type = (x0,y0,text,color,emit) => {
  console.log("we are typing " + text + "here:" + x0 + y0)
  contextRef.current.font = "bold 20px sans-serif"
  contextRef.current.textBaseline = "top"
  contextRef.current.fillStyle = color;          
  contextRef.current.fillText(text,x0, y0)

  if (!emit) { return; }

  socketRef.current.emit('text', {
    x0: x0,
    y0: y0,
    text,
    color,
  });

}


  //when click the eraser button set tool name as a "eraser"
  const getEraser = () => {
    setToolName("eraser");
  }
  const getPen = () => {
    setToolName("pen");
  }
  const getRect = () => {
    setToolName("rect");
  }
  const getCircle = () => {
    setToolName("circle");
  }
  const getText = () => {
  	setToolName("text");
    setDisableInput("");
  }
  const getLine = () => {
  	setToolName("line");
  }
  const getEmogi = (emogiType) => {
  	setEmogi(emogiType);
  }

  const getColor = (color) => {
  	current.color = color;
  }


    // ---------------- mouse movement --------------------------------------

      const onMouseDown = (e) => {
        if(toolName !== 'text'){
          drawing = true;
          if(inputBox !== 'hidden'){
            setInputBox('hidden');
          }
        }
        else{
          if(inputBox === 'hidden'){
            setInputBox('');
          }
          setOldStartPoint([keyStartPoint[0], keyStartPoint[1]])
          setKeyStartPoint([e.nativeEvent.offsetX, e.nativeEvent.offsetY])
        }
        current.x = e.nativeEvent.offsetX;
        current.y = e.nativeEvent.offsetY;
        console.log(current.x, current.y)
      };
  
      const onMouseMove = (e) => {
        if (!drawing) { return; }
        //here we  want to trigger draw for pen and eraser
        if(toolName === "pen" || toolName === "eraser"){
          draw(current.x, current.y, e.nativeEvent.offsetX, e.nativeEvent.offsetY, toolName, current.color, true);
          current.x = e.nativeEvent.offsetX;
          current.y = e.nativeEvent.offsetY;
        }
      };
  
      const onMouseUp = (e) => {
        console.log(isDrawing, toolName, current.x, current.y)
        if (!drawing) { return; }
        drawing = false;
        //here we want to trigger draw for rect, circle, and line
        draw(current.x, current.y, e.nativeEvent.offsetX, e.nativeEvent.offsetY, toolName, current.color, true);
      };

  // ---------------- keyDown Event --------------------------------------
  function drawText(event, blur = false){
      console.log(event.target.value, current.x, current.y)
    	console.log(blur)
      console.log(event.keyCode);
      
    //when Enter is pressed the text is drawn on canvas
    //and the input field is set to hidden
    if(event.key === "Enter" || blur === true){
      if(event.key === "Enter"){
        setKeyStartPoint([keyStartPoint[0], keyStartPoint[1] + 20]);
        type(current.x, current.y, event.target.value, color, true)
      }
      else{
        type(oldStartPoint[0], oldStartPoint[1],event.target.value,color,true)
      }
      
      event.target.value = ""
    }
  }
    				
  
  // ----------- limit the number of events per second -----------------------

  const throttle = (callback, delay) => {
    let previousCall = new Date().getTime();
    
    return function() {
      const time = new Date().getTime();
      if ((time - previousCall) >= delay) {
        previousCall = time;
        callback.apply(null, arguments);
      }
    };
  };

  return (
    <div>
      <div className = "tool-container">
        <button onClick={() =>{getEmogi("👆");}} style={{ width:"40px", border:"none" }} id="blue">👆</button>
        <button onClick={() =>{getEmogi("✍");}} style={{ width:"40px", border:"none" }} id="blue">✍</button>
        <button onClick={() =>{getEmogi("👋");}} style={{ width:"40px", border:"none" }} id="black">👋</button>
        <button onClick={() =>{ getEmogi("🐶");}} style={{ width:"40px", border:"none" }} id="red">🐶</button>
       
        <button onClick={() =>{getColor("blue");}} style={{backgroundColor:"blue", width:"40px" , borderRadius:"100%", border:"none" }} id="blue"/>
        <button onClick={() =>{getColor("black");}} style={{backgroundColor:"black" ,  width:"40px" , borderRadius:"100%", border:"none" }} id="black"/>
        <button onClick={() =>{ getColor("green");}} style={{backgroundColor:"green", width:"40px" , borderRadius:"100%", border:"none" }} id="green"/>
        <button onClick={() =>{ getColor("red");}} style={{backgroundColor:"red", width:"40px" , borderRadius:"100%", border:"none" }} id="red"/>

        <button onClick={getEraser} id="eraser">Eraser</button>
        <button onClick={getPen} id="pen">Pen</button>
        <button onClick={getRect} id="rect">Rect</button>
        <button onClick={getCircle} id="circle">Circle</button>
        <button onClick={getLine} id="line">Line</button>
        <button onClick={getText} id="text">Text</button>
      </div>
      
      <div className = "canvas-container">
        <canvas id="canvas_3_ID"
          ref={canvasRef3}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseMove={(e) => throttle(onMouseMove(e), 10)}
        />
        <canvas
          id = "overlay"
          ref={canvasRef}
        />
        <input 
        type = "text"
        id = "textbox"
        onKeyDown ={drawText}
          style = {{
          	position : "absolute",
            visibility :`${inputBox}`,
            left:`${keyStartPoint[0]}px`,
    				top:`${keyStartPoint[1]}px`,
            pointerEvents: `${disableInput}`
          }}
        onBlur = {(e) => {
           drawText(e,true)
          }}
        ></input>
        <canvas id="images"
          ref={canvasRef2}
        />
      </div>

      <div className = "tool-container" style={{width:"800px",height:"auto", display:"block" ,position:"relative", 
       top:"600px", paddingTop:"10px",left:"0px"
    }} >
      </div>
    </div>
  );
}

export default Whiteboard;
