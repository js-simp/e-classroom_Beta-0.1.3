import React, { useEffect, useRef, useState } from 'react';
import SlidesBar from './SlidesBar';
import db from '../Firebase/firebase';
//icons for the whiteboard
import IconButton from '@material-ui/core/IconButton';
import TouchAppIcon from '@material-ui/icons/TouchApp';
import KeyboardIcon from '@material-ui/icons/Keyboard';
import CreateIcon from '@material-ui/icons/Create';
import CropDinIcon from '@material-ui/icons/CropDin';
import StopIcon from '@material-ui/icons/Stop';
import RadioButtonUncheckedOutlinedIcon from '@material-ui/icons/RadioButtonUncheckedOutlined';
import Brightness1Icon from '@material-ui/icons/Brightness1';
import TimelineIcon from '@material-ui/icons/Timeline';



import './Whiteboard.css';

const Whiteboard = (props) => {

  const [isDrawing, setIsDrawing] = useState(false);
  const [toolName, setToolName] = useState("pen");
  const [emogi, setEmogi] = useState("👆");
  const[color,setColor]= useState("");

  const [oldStartPoint, setOldStartPoint] = useState([0,0])
  const [keyStartPoint, setKeyStartPoint] = useState([0,0])

  const count = useRef([]);
  const [selected, setSelected] = useState({active : '', title :''});
  const [annotations, setAnnotations] = useState();


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

    //realtime listening for annotations and changes
    db.collection("Sessions").doc(props.sessionId)
    .onSnapshot((doc) => {
        console.log("Current data: ", doc.data());
        setAnnotations(doc.data());
    });
  }, []);



  useEffect(() => {
    if (count.current.length !== 0) {
      //load image and annotations to page
      //loading the annotations
      if(annotations[props.lessonTitles[count.current[0]]][count.current[1]]!== undefined){
        console.log(`We have annotations for this page: ${count.current[0]} ${count.current[1]}`)
        let image = document.createElement('img');
        image.src = annotations[props.lessonTitles[count.current[0]]][count.current[1]];
        image.onload = function () {
          contextRef.current.drawImage(image, 0, 0)
        }
        
      }
      else{
        // contextRef.current.fillStyle = "rgba(255, 255, 255, 0)"
        contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      }
      //image loading canvas
      var image = document.getElementById(`${props.lessonTitles[count.current[0]]}${count.current[1]}`);
      let src = image.src;
      contextRef2.current.drawImage(image, 0, 0, 800, 600);
      socketRef.current.emit('image', {
        src,
        page : count.current[1],
        title : props.lessonTitles[count.current[0]],
      });
    }
}, [count.current])

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
  

  
  const current = {
    color: 'black',
  };
  let drawing = false;
   // ------------------------------- create the drawing ----------------------------

 const draw = (x0, y0, x1, y1, toolName, color, emit) => {
   console.log(x0,y0,x1,y1)
  contextRef3.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
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
  else if (toolName === "pointer"){
      contextRef3.current.moveTo(x0,y0);
      contextRef3.current.textAlign = 'left';
      contextRef3.current.font = "50px sans-serif";
      contextRef3.current.fillText( emogi ,x0, y0);
      contextRef3.current.fillStyle = "red"; 
      contextRef3.current.font = "10px sans-serif";
      contextRef3.current.textAlign = 'left';
      contextRef3.current.fillText(x1, x0,y0);
      
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
  const getPointer = () => {
  	setToolName("pointer");
  }

  const getColor = (color) => {
  	current.color = color;
  }


//new annotaitons [[], []]
  const  getSlide = (lessonTitle , buttonindexID) => {

    //change the styling of the button by updating selected state
    setSelected({active : buttonindexID, title : lessonTitle})
    // get the lesson idex
    let lessonIndex = props.lessonTitles.indexOf(lessonTitle);
    //ensuring annotation database only updates when page is changed
    if(count.current.length !== 0 && (count.current[0] !== lessonIndex || count.current[1] !== buttonindexID)){
      // new_annotations[count] = contextRef.current.getImageData(
      //   0, 0, canvasRef.current.width, canvasRef.current.height)
      db.collection("Sessions").doc(`${props.sessionId}`).update({
        
      [`${props.lessonTitles[count.current[0]]}.${count.current[1]}`] : canvasRef.current.toDataURL()

      });
      contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      count.current = [lessonIndex, buttonindexID]
    }

    else if(count.current.length === 0){
      contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      count.current = [lessonIndex, buttonindexID]
      setToolName('Image')
    }

    else{
      return;
    }
    
    
    //emit the event for loading image and annotations on student side....
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
        // console.log(current.x, current.y)
      };
  
      const onMouseMove = (e) => {
        if (!drawing) { 
          return; 
        }
        //here we  want to trigger draw for pen and eraser
        if(toolName === "pen" || toolName === "eraser"){
          draw(current.x, current.y, e.nativeEvent.offsetX, e.nativeEvent.offsetY, toolName, current.color, true);
          current.x = e.nativeEvent.offsetX;
          current.y = e.nativeEvent.offsetY;
        }
        else if(toolName === 'rect' || toolName === 'line' || toolName === 'circle' || toolName === 'pointer'){
          contextRef3.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
          contextRef3.current.globalCompositeOperation = "source-over";
          contextRef3.current.beginPath();
          contextRef3.current.strokeStyle = color;
          if(toolName === 'rect'){
            contextRef3.current.strokeRect(current.x, current.y, e.nativeEvent.offsetX-current.x, e.nativeEvent.offsetY-current.y);
          }
          else if(toolName === 'circle'){
            const a = (e.nativeEvent.offsetX - current.x);
            const b = (e.nativeEvent.offsetY - current.y)
            const length = (Math.sqrt((a * a) + (b * b)))
            const radius = length/2
            contextRef3.current.arc((current.x + e.nativeEvent.offsetX)/2, (current.y + e.nativeEvent.offsetY)/2, radius,0, 2 * Math.PI);
            contextRef3.current.stroke();
          }
          else if (toolName === 'line'){
            contextRef3.current.moveTo(current.x,current.y)
            contextRef3.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
            contextRef3.current.stroke();
          }
          else{
            draw(e.nativeEvent.offsetX, e.nativeEvent.offsetY, props.username.split(' ')[0] , 0, toolName, current.color, true)
          }
          
        }
      };
  
      const onMouseUp = (e) => {
        console.log(drawing, toolName, current.x, current.y)
        if (!drawing) { return; }
         //here we want to trigger draw for rect, circle, and line
          if(toolName !== 'pointer'){
            draw(current.x, current.y, e.nativeEvent.offsetX, e.nativeEvent.offsetY, toolName, current.color, true);
          }
          else{
            contextRef3.current.clearRect(0,0,canvasRef.current.width, canvasRef.current.height)
          }
        drawing = false;
       
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
  //--------------load lessons into slide bar --------------------------------
  const loadLessons = () =>{
    return(
      <div className = "lesson-container">
        {
          props.lessonSlides.map((user, index) => {
              return(
                <SlidesBar
                  slidesArr = {props.lessonSlides[index]}
                  lessonTitle = {props.lessonTitles[index]}
                  selected = {selected}
                  getSlide = {getSlide}
                  />
              )
          })
        }
      </div>
    )
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
        <IconButton>
          <TouchAppIcon onClick={() => {getPointer()}} id="pointer" aria-label = 'pointer' color = 'primary' style = {{'font-size': '40px'}}/>
        </IconButton>
        
        <IconButton>
          <Brightness1Icon onClick={() => {getColor('blue')}} id="blue" aria-label = 'color' style = {{'font-size': '40px', 'color': '#4885ed'}}/>
        </IconButton>
        <IconButton>
          <Brightness1Icon onClick={() => {getColor('black')}} id="black" aria-label = 'color'  style = {{'font-size': '40px', 'color': '#000000'}}/>
        </IconButton>
        <IconButton>
          <Brightness1Icon onClick={() => {getColor('green')}} id="green" aria-label = 'color' style = {{'font-size': '40px', 'color': '#3cba54'}}/>
        </IconButton>
        <IconButton>
          <Brightness1Icon onClick={() => {getColor('red')}} id="red" aria-label = 'color' style = {{'font-size': '40px', 'color': '#db3236'}}/>
        </IconButton>

        <IconButton>
          <KeyboardIcon onClick={getText} id="text" aria-label = 'text' color = 'primary' style = {{'font-size': '40px'}}/>
        </IconButton>
        <IconButton>
          <CreateIcon onClick={getPen} id="pen" aria-label = 'pen' color = 'primary' style = {{'font-size': '40px'}}/>
        </IconButton>
        <IconButton>
          <RadioButtonUncheckedOutlinedIcon  onClick={getCircle} id="circle" aria-label = 'circle' color = 'primary' style = {{'font-size': '40px'}}/>
        </IconButton>
        <IconButton>
          <CropDinIcon onClick={getRect} id="rect" aria-label = 'rect' color = 'primary' style = {{'font-size': '40px'}}/>
        </IconButton>
        <IconButton>
          <TimelineIcon onClick={getLine} id="line" aria-label = 'line' color = 'primary' style = {{'font-size': '40px'}}/>
        </IconButton>
        <IconButton>
          <StopIcon onClick={getEraser} id="eraser" aria-label = 'eraser' style = {{'font-size': '40px'}}/>
        </IconButton>
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

      <div className = "tool-container" style={{width:"auto",height:"auto" ,position:"relative", 
       top:"600px", paddingTop:"10px"
    }} >
      <div className = 'slides-bar'>
        {loadLessons()}
      </div>
      </div>
      
    </div>
  );
}

export default Whiteboard;

