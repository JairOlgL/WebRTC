<<<<<<< HEAD
const socket = io('http://192.168.100.100:6532');
=======
const socket = io('http://192.168.100.123:6532');
>>>>>>> 2800fbb5e4a72dcb87ddac9f4a23f5515e1ae69a
const llamar = document.getElementById('callButton');
const config = {
  iceServers: [{urls: 'stun:stun.l.google.com:19302'}]
}
const peerConnection = new RTCPeerConnection(config);
const localVideo = document.querySelector('#localVideo');
const remoteVideo = document.getElementById('remoteVideo');
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
  remoteVideo.srcObject = peerConnection.getRemoteStreams()[0]
}

socket.on('getID', id => {
  idEmisor = id;
  document.getElementById('id').innerHTML = idEmisor;
})
socket.on('signal', async ({offer, candidate, idEmisor, answer}) => {
  if(offer){
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