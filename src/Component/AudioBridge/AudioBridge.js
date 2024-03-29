//this is where we want the classroom to start and janus to get us started!
import IconButton from '@material-ui/core/IconButton';
import { MicOutlined, MicOffOutlined } from '@material-ui/icons';
import {React,useState, useEffect} from 'react'
import Janus from '../Janus/janus.nojquery';
import './AudioBridge.css';


let audioBridge = null;
let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let analyser = audioCtx.createAnalyser();


let source = null;
let canvasMeter = null;
let canvasMeterCtx = null;
let drawVisual;


function isRoom(room, username, role){
	//first we conver the string of roomId to an integer
	let roomId = parseInt(room)
	//we are going to request to check if room exists
	const existReq = {
        "request" : "exists",
        "room" : roomId
	}

	audioBridge.send({
		message: existReq,
		success : function(msg) {
			if(msg["exists"]){
				joinRoom(roomId,username);
			}
			else{
				console.log("Tutor hasn't launched the session yet")
				if(role === 'tutor'){
					createRoom(roomId, username);
				}
				
			}
		}
	})
	
}

function createRoom(roomId, username){
	//first we have to convert the string of roomId ex: "3323" to integer 3323
	//we are going to request to create a room of the name roomId
	const createReq =  {
        "request" : "create",
        "room" : roomId,
        "is_private" : true,
        "sampling_rate" : 16000,
        "audiolevel_ext" : true,
        "audiolevel_event" : false
}
	//send the create request as a message to the plugin (audioBridge)
	audioBridge.send({
		message : createReq,
		success : function(){
			console.log("Successfully created room" + roomId)
			joinRoom(roomId, username)
		}
	})

}
//only called by tutor
function destroyRoom(roomId){
	let room = parseInt(roomId)
	const destroyReq = {
		"request" : "destroy",
        "room" : room,
	}

	audioBridge.send({
		message : destroyReq,
		success : function(response) {
			// alert("Destroyed the room");
			console.log(response);
		}
	})
}


function joinRoom(roomId, username){
	let names = username.split(' ');
	let firstname = names[0];
	//creating the request to join the room
	const joinReq = {
        "request" : "join",
        "room" : roomId,
        "display" : firstname
	}
	//send the join request as a message to the plugin (audioBridge)
	audioBridge.send({message : joinReq})
	//join room and then start capturing the canvas

}

function attachremote(stream) {
	const remoteAudio= document.createElement('audio')
	remoteAudio.setAttribute("autoplay", true);
	Janus.attachMediaStream(remoteAudio, stream);
}

//The microphone meter
function microphoneMeter(stream){
	source = audioCtx.createMediaStreamSource(stream);
	source.connect(analyser);

	analyser.fftSize = 2048;
	let bufferLength = analyser.frequencyBinCount;
	let dataArray = new Uint8Array(bufferLength);
	

	//drawing the dataArry onto the canvas
	canvasMeter = document.getElementById("microphoneMeter");
	canvasMeterCtx = canvasMeter.getContext('2d');
	const WIDTH = canvasMeter.width;
	const HEIGHT = canvasMeter.height;

	let draw = function(){
		drawVisual = requestAnimationFrame(draw);
		analyser.getByteTimeDomainData(dataArray);

        canvasMeterCtx.clearRect(0, 0, WIDTH, HEIGHT);

		canvasMeterCtx.lineWidth = 2;
		canvasMeterCtx.strokeStyle = 'rgb(0, 0, 0)';
		canvasMeterCtx.beginPath();
		let sliceWidth = WIDTH * 1.0 / bufferLength;
		let x = 0;

		for(var i = 0; i < bufferLength; i++) {

			var v = dataArray[i] / 128.0;
			var y = v * HEIGHT/2;
	
			if(i === 0) {
			  canvasMeterCtx.moveTo(x, y);
			} else {
			  canvasMeterCtx.lineTo(x, y);
			}
	
			x += sliceWidth;
		}
		canvasMeterCtx.lineTo(WIDTH, HEIGHT/2);
		canvasMeterCtx.stroke();
	}
	draw();
}


//The main audiobridge component
function AudioBridge(props) {
	// const [sessionStatus, setSessionStatus] = useState('running')
	const [connectionStatus, setConnectionStatus] = useState(['block', 0.5, 'none'])
	const [isMute,setIsMute] = useState(false);
	const roomId = props.sessionId;
	const username = props.username;
	const studentId = props.studentId;
	const role = props.role;

	let webrtcUp = false;
	useEffect(() => {
	Janus.init({
		debug: true,
		callback: function() {
				// Done!
				console.log("Initialized Janus")
				let janus = new Janus(
					{
							server: process.env.REACT_APP_JANUS_SERVER,
							iceServers: [
								{ urls: 'stun:stun.l.google.com:19302' },
								{ urls: 'turn:openrelay.metered.ca:443?transport=tcp', credential: 'openrelayproject', username: 'openrelayproject' },
								{ urls: 'turn:openrelay.metered.ca:443', credential: 'openrelayproject', username: 'openrelayproject' }
							],
							success: function() {
									// Done! attach to plugin XYZ
									janus.attach(
										{
												plugin: "janus.plugin.audiobridge",
												success: function(pluginHandle) {
														// Plugin attached! 'pluginHandle' is our handle
														console.log(`We've succesfully attached ${pluginHandle.getPlugin()}`)
														audioBridge = pluginHandle;
														// if(sessionStatus === 'end'){
														// 	janus.destroy()
														// }
														
														/*We are going to check if the room with roomId is available
														if not we create the room using createRoom(), if the room
														exists we'll simply join the room
														*/
														isRoom(roomId, username, role)
														

												},
												error: function(cause){
															// Plugin not attached!
															console.log(`Couldn't attach plugin because ${cause}`)
												},
												consentDialog: function(on) {
														// e.g., Darken the screen if on=true (getUserMedia incoming), restore it otherwise
														if(on){
															document.body.classList.add("darken")
														}
														else{
															document.body.classList.remove("darken")
														}
												},
												webrtcState: function(on){
													Janus.log("Janus says our WebRTC PeerConnection is " + (on ? "up" : "down") + " now");
													if(on){
														setConnectionStatus(['none', 1,'block']);
													}
													else if(!on){
														setConnectionStatus(['block', 0.5, 'none'])
													}
													
												},
												onmessage: function(msg, jsep) {
														// We got a message/event (msg) from the plugin
														// If jsep is not null, this involves a WebRTC negotiation
														Janus.debug(" ::: Got a message :::", msg);
														let event = msg["audiobridge"]
														Janus.debug("Event: " + event);
														if(event){
															if(event === "joined"){
																console.log(msg)
																Janus.log("Awesome! New person in room" + msg["room"])
																if(!webrtcUp) {
																	webrtcUp = true;
																	// Publish our stream
																	audioBridge.createOffer(
																		{
																			media: { audio: true, video: false },	// This is an audio only room
																			success: function(jsep) {
																				Janus.debug("Got SDP!", jsep);
																				var publish = { request: "configure", muted: false };
																				audioBridge.send({ message: publish, jsep: jsep });
																			},
																			error: function(error) {
																				Janus.error("WebRTC error:", error);
																			}
																		});
																}
																//identifying when student has joined the room
																if(msg["participants"] && role === 'tutor'){
																	let list = msg["participants"];
																	for (let participant in list) {
																		if(list[participant]["id"] === studentId){
																			console.log("The student has joined!")
																		}
																	  }
																}
															}
															else if(event === "destroyed") {
																// The room has been destroyed
																Janus.warn("The room has been destroyed!");
																janus.destroy();
															}
														}

														if(jsep) {
															Janus.debug("Handling SDP as well...", jsep);
															audioBridge.handleRemoteJsep({ jsep: jsep });
														}					
												},
												onlocalstream: function(stream) {
														// local stream available to attach to an element
														microphoneMeter(stream);
												},
												onremotestream: function(stream) {
														// A remote track (working PeerConnection!) with a specific mid has just been added or removed
														attachremote(stream)
												},
												ondataopen: function(){
													//sending data and can activate data channel
												},
												oncleanup: function() {
														// PeerConnection with the plugin closed, clean the UI
														// The plugin handle is still valid so we can create a new one
														webrtcUp = false;
												},
												detached: function() {
														// Connection with the plugin closed, get rid of its features
														// The plugin handle is not valid anymore
												}
										});
							},
							error: function(cause) {
									// Error, can't go on...
									console.log(cause);
									alert('Could not create session, please try reloading the page')
									window.location.reload();
							},
							destroyed: function() {
									// I should get rid of this when the End Session button is clicked
									window.location.reload();
							}
					});
		}
		});
	}, [])

	//implementing mic button conditional rendering
	let button;
	if (isMute) {
		button = <IconButton>
					<MicOffOutlined onClick={() => {toggleMute();}}  style = {{'font-size': '35px', 'color': '#db3236'}}  />
				</IconButton>
	  } else {
		button = <IconButton color = 'primary'>
					<MicOutlined onClick={() => {toggleMute();}}  style = {{'font-size': '35px'}}  />
				</IconButton>
	  }

	function toggleMute() {
		audioBridge.send({ message: { request: "configure", muted: !isMute }}); //sending message that mic has been unmuted
		setIsMute(!isMute);
	}
	
	return(
		<div>
			{button}
			<canvas id = "microphoneMeter" width = "100" height = "33"/>
			<div class="audio-status-symbol" id="audio-connected-symbol"
			style = {
				{
					display : `${connectionStatus[2]}`,
            		opacity :`${connectionStatus[1]}`,
				}
			} >
  			<p>CONNECTED</p>
			</div>
			<div class="audio-status-symbol" id="audio-connecting-symbol"
			style = {
				{
					display : `${connectionStatus[0]}`,
            		opacity :`${connectionStatus[1]}`,
				}
			} >
  			<p>CONNECTING</p>
			</div>
			{ role === 'tutor' &&
				<button
				onClick = {
					()=> destroyRoom(roomId)
				}
				>
				End Session
				</button>
			}
		</div>
	)
}


export default AudioBridge