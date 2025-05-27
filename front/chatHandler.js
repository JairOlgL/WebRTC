
dataChannel.onopen = () => {
    console.log('Canal de chat listo.');
}
dataChannel.onmessage = event => {
    console.log(`Mensaje recibido: ${event.data}`);
}
peerConnection.ondatachannel = event => {
    dataChannel = event.channel;
}