
peerConnection.ondatachannel = event => {
    console.log('Channel')
    dataChannel = event.channel;
    dataChannel.onmessage = event => {
        console.log(`Mensaje recibido: ${event.data}`);
        const remoteMessage = document.createElement('p');
        remoteMessage.innerHTML = `<b>Remoto:</b> ${event.data}`;
        document.getElementById('chatContainer').appendChild(remoteMessage);
    }
}
const sendMessage = message => {
    if(dataChannel && dataChannel.readyState == 'open'){
        dataChannel.send(message);
    }
}
document.getElementById('chatInput').addEventListener('keypress', event => {
    if(event.key == 'Enter'){
        const localMessage = document.createElement('p');
        localMessage.innerHTML = `<b>Tú:</b> ${event.target.value}`;
        document.getElementById('chatContainer').appendChild(localMessage);
        sendMessage(event.target.value);
        event.target.value = '';
    }
})
document.getElementById('chat').onclick = () => {
    document.getElementById('chatContainer').style.transform = document.getElementById('chatContainer').style.transform ? '' : 'translateX(-640px)';
}