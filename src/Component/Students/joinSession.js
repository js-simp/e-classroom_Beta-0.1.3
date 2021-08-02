
import db from '../Firebase/firebase.js'

async function getMedia(localConnection) {
  let localStream = null;
  localStream = await navigator.mediaDevices.getUserMedia({video: false, audio: true});

  localStream.getTracks().forEach((track) => {
    localConnection.addTrack(track, localStream);
})
  return localStream;
}

async function joinSession(sessionId) {
    console.log(sessionId)
    //you can specify a STUN server here
    const servers = {
        iceServers: [
          {
            urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
          },
        ],
        iceCandidatePoolSize: 10,
      };

    const localConnection = new RTCPeerConnection(servers)

    //create a stream of my audio
    await getMedia(localConnection)

    const remoteStream = new MediaStream();
    const remoteAudio = document.querySelector('#remoteStream');
    remoteAudio.srcObject = remoteStream;

    localConnection.addEventListener('track', async (event) => {
    remoteStream.addTrack(event.track, remoteStream);
});
    

    const sessionDoc = db.collection('Sessions').doc(`${sessionId}`);
    const offerCandidates = sessionDoc.collection('OfferCandidates');
    const answerCandidates = sessionDoc.collection('AnswerCandidates')

    //listen for ice candidates and add them to the offerCandidates document

    localConnection.onicecandidate = e =>  {
        console.log(" NEW ice candidate!! on localconnection reprinting SDP " );
        console.log(JSON.stringify(localConnection.localDescription));
        e.candidate && answerCandidates.add(e.candidate.toJSON());
        }

    const callData = (await sessionDoc.get()).data();

    const offerDescription = callData.Offer;
    await localConnection.setRemoteDescription(offerDescription)

    const answerDescription = await localConnection.createAnswer();
    await localConnection.setLocalDescription(answerDescription);

    const answer = {
        type: answerDescription.type,
        sdp: answerDescription.sdp
        
    }

    await sessionDoc.update({answer});

    offerCandidates.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) =>{
            console.log(change)
            if(change.type === 'added'){
                let data = change.doc.data();
                localConnection.addIceCandidate(new RTCIceCandidate(data));
            }
        })
    })

}


export default joinSession;