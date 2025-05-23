const socket = io(`https://192.168.100.100:6532`);
const llamar = document.getElementById('callButton');
const config = {
  iceServers: [{urls: 'stun:stun.l.google.com:19302'}]
}
const peerConnection = new RTCPeerConnection(config);
const localVideo = document.querySelector('#localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const localStreaming = document.getElementById('localStreaming');
const remoteStreaming = document.getElementById('remoteStreaming');
let localStream;
let idEmisor;

const startMedia = async () => {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.srcObject = localStream;
    localStream.getTracks().forEach(el => {
      peerConnection.addTrack(el, localStream);
    })
  } catch (error) {
    console.error('Error al acceder a medios:', error);
  }
}

llamar.onclick = async () => {
  const idReceptor = document.getElementById('toCall').value;
  sessionStorage.idReceptor = idReceptor;
  await peerConnection.createOffer()
  .then(offer => peerConnection.setLocalDescription(offer))
  .then(() => {
    socket.emit('signal', {offer: peerConnection.localDescription, idReceptor});
  })
}
peerConnection.onicecandidate = ({candidate}) => {
  const idReceptor = document.getElementById('toCall').value;
  if(candidate) socket.emit('signal', {candidate, idReceptor});
}
peerConnection.ontrack = event => {
  remoteVideo.style.display = 'block'
  remoteVideo.srcObject = peerConnection.getRemoteStreams()[0]
  if(peerConnection.getRemoteStreams()[1]){
    remoteVideo.style.gridColumn = '1/2';
    remoteStreaming.style.display = 'block';
    remoteStreaming.srcObject = peerConnection.getRemoteStreams()[1];
  }
}
peerConnection.onnegotiationneeded = async event => {
  await peerConnection.createOffer()
  .then(offer => {
    offer.sdp = offer.sdp.replace(/a=fmtp:opus (.+)/g, 'a=fmtp:opus maxaveragebitrate=510000; stereo=1; sprop-stereo=1; maxplaybackrate=48000; useinbandfec=1; usedtx=0;').replace(/a=rtpmap:(\d+) opus\/48000\/2/g, 'a=rtpmap:$1 opus/48000/2\r\na=maxaveragebitrate:510000\r\na=stereo:1\r\na=sprop-stereo:1');
    return peerConnection.setLocalDescription(offer);
  })
  .then(() => {
    socket.emit('signal', {offer: peerConnection.localDescription, idReceptor: sessionStorage.idReceptor});
  })
}

socket.on('getID', id => {
  sessionStorage.idEmisor = id;
  idEmisor = id;
  document.getElementById('id').innerHTML = idEmisor;
})
socket.on('signal', async ({offer, candidate, idEmisor, answer}) => {
  if(offer){
    //alert(idEmisor);
    await peerConnection.setRemoteDescription(offer)
    .then(async() => await peerConnection.createAnswer())
    .then(async answer  => await peerConnection.setLocalDescription(answer))
    .then(() => {
      socket.emit('signal', {answer: peerConnection.localDescription, idEmisor});
    })
  }
  if(answer) await peerConnection.setRemoteDescription(answer);
  if(candidate) await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
})

startMedia();
