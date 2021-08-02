//this is where we want the classroom to start and janus to get us started!
import {React, useEffect} from 'react'
import Janus from '../Janus/janus.nojquery';
import './AudioBridge.css'

let audioBridge = null;

function isRoom(room, username){
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
			}
		}
	})
	
}

function joinRoom(roomId, username){
	let names = username.split(' ');
	let firstname = names[0];
	console.log("Ready to join room " + roomId + 'baby!!')
	//creating the request to join the room
	const joinReq = {
        "request" : "join",
        "room" : roomId,
        "display" : firstname
	}
	//send the join request as a message to the plugin (audioBridge)
	audioBridge.send({message : joinReq})

}

function attachremote(stream) {
	const remoteAudio= document.createElement('audio')
	remoteAudio.setAttribute("autoplay", true);
	Janus.attachMediaStream(remoteAudio, stream);
}

function StudentAudioBridge(props) {
	const roomId = props.sessionId;
	const username = props.username;

	let webrtcUp = false;
	useEffect(() => {
		console.log(`Hi ${props.username} you are ready to join ${props.sessionId}` )
	Janus.init({
		debug: true,
		callback: function() {
				// Done!
				console.log("Initialized Janus")
				let janus = new Janus(
					{
							server: 'https://18.216.138.59/janus/',
							iceServers: [
								{ urls: 'stun:stun.l.google.com:19302' },
								{ urls: 'turn:18.217.79.41:3478?transport=tcp', credential: 'pass1', username: 'user1' }
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
														/*We are going to check if the room with roomId is available
														if not we create the room using createRoom(), if the room
														exists we'll simply join the room
														*/
														isRoom(roomId, username)
														
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
															}
															else if(event === "destroyed") {
																// The room has been destroyed
																Janus.warn("The room has been destroyed!");
															}
														}

														if(jsep) {
															Janus.debug("Handling SDP as well...", jsep);
															audioBridge.handleRemoteJsep({ jsep: jsep });
														}					
												},
												onlocalstream: function(stream) {
														// local stream available to attach to an element
												},
												onremotestream: function(stream) {
														// A remote track (working PeerConnection!) with a specific mid has just been added or removed
														//Here we will be getting the canvasStream with the audio track attached
														attachremote(stream)
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
	
	return(
		<div>
			<h1>Here is the classroom</h1>
		</div>
	)
}

export default StudentAudioBridge
