document.getElementById('camara').onclick = event => {
    event.target.src = /Video.svg/.test(event.target.src) ? './mage icons/bulk/Video Cross.svg' : './mage icons/bulk/Video.svg';
    localStream.getVideoTracks()[0].enabled = !localStream.getVideoTracks()[0].enabled;

}
document.getElementById('mute').onclick = event => {
    localStream.getAudioTracks()[0].enabled = !localStream.getAudioTracks()[0].enabled;
    event.target.src = /Microphone.svg/.test(event.target.src) ? './mage icons/bulk/Microphone Mute.svg' : './mage icons/bulk/Microphone.svg';
}
document.getElementById('compartir').onclick = async() => {
    const sharedScreen = await navigator.mediaDevices.getDisplayMedia({
        video: {
            cursor: 'always',
        },
        audio: {
            channelCount: 2,
            sampleRate: 48000,
            sampleSize: 24,
            volume: 1.0,
            autoGainControl: false,
            noiseSuppression: false,
            echoCancellation: false
        }
    })
    const sharedScreenAux = peerConnection.getLocalStreams()[1];
    const videoTrack = peerConnection.addTrack(sharedScreen.getVideoTracks()[0], sharedScreenAux ? sharedScreenAux : sharedScreen);
    const audioTrack = peerConnection.addTrack(sharedScreen.getAudioTracks()[0], sharedScreenAux ? sharedScreenAux : sharedScreen);
    localVideo.style.gridColumn = '1/2';
    document.getElementById('localStreaming').style.display = 'block';
    document.getElementById('localStreaming').srcObject = sharedScreen;
    sharedScreen.getVideoTracks()[0].addEventListener('ended', event => {
        videoTrack.track.stop();
        audioTrack.track.stop();
        peerConnection.removeTrack(videoTrack);
        peerConnection.removeTrack(audioTrack);
        localVideo.style.gridColumn = '';
        localStreaming.style.display = '';
    })
}