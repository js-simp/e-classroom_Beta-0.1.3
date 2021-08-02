
import db from '../Firebase/firebase.js'

async function getMedia(localConnection) {
  let localStream = null;
  localStream = await navigator.mediaDevices.getUserMedia({video: false, audio: true});

  localStream.getTracks().forEach((track) => {
    localConnection.addTrack(track, localStream);
})
  return localStream;
}


//here we want to setup the local SDP and create offer
async function launchSession(sessionId) {
    console.log(sessionId);

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
        e.candidate && offerCandidates.add(e.candidate.toJSON());
        }

    //create the offer (the local SDP) and add to the offer document

    const offerDescription =  await localConnection.createOffer()
    await localConnection.setLocalDescription(offerDescription)

    const Offer = {
        sdp : offerDescription.sdp,
        type : offerDescription.type
    }

    await sessionDoc.set({Offer})

    //adding the remote Description by checking if the sessionDoc has got an answer

    sessionDoc.onSnapshot(async snapshot => {
        const data = snapshot.data();
        if(!localConnection.currentRemoteDescription && data.answer){
            const answerDescription = new RTCSessionDescription(data.answer);
            await localConnection.setRemoteDescription(answerDescription)
        }
    })
    //if there are new answer candidates added by the student, then add them to my remote description

    answerCandidates.onSnapshot(snapshot => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
                const candidate = new RTCIceCandidate(change.doc.data());
                localConnection.addIceCandidate(candidate)
            }
        })
    })

    }

export default launchSession;