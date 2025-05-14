const socket = io('http://localhost:6532');
const llamar = document.getElementById('callButton');
const config = {
  iceServers: [{urls: 'stun:stun.l.google.com:19302'}]
}
const peerConnection = new RTCPeerConnection(config);
const localVideo = document.querySelector('#localVideo');
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

llamar.onclick = () => {
  const idReceptor = document.getElementById('toCall').value;
  peerConnection.createOffer()
  .then(offer => peerConnection.setLocalDescription(offer))
  .then(() => {
    socket.emit('signal', {offer: peerConnection.localDescription, idReceptor});
  })
}

socket.on('getID', id => {
  idEmisor = id;
  document.getElementById('id').innerHTML = idEmisor;
})
socket.on('signal', ({offer}) => {
  peerConnection.setRemoteDescription(offer)
  .then(() => peerConnection.createAnswer())
  .then(answer  => peerConnection.setLocalDescription(answer))
  .then(() => {
    socket.emit('signal', {answer: peerConnection.localDescription, idEmisor});
  })
})

startMedia();