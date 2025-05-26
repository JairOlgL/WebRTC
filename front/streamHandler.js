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
            /* width: {ideal: 1920},
            height: {ideal: 1080},
            frameRate: {max: 10000000} */
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
    peerConnection.addTrack(sharedScreen.getVideoTracks()[0], sharedScreenAux ? sharedScreenAux : sharedScreen);
    peerConnection.addTrack(sharedScreen.getAudioTracks()[0], sharedScreenAux ? sharedScreenAux : sharedScreen);
    localVideo.style.gridColumn = '1/2';
    document.getElementById('localStreaming').style.display = 'block';
    document.getElementById('localStreaming').srcObject = sharedScreen;
    sharedScreen.getVideoTracks()[0].addEventListener('ended', event => {
        peerConnection.getLocalStreams()[1].forEach(element => {
            peerConnection.removeTrack(element, peerConnection.getLocalStreams()[1])
        });
        localVideo.style.gridColumn = '';
        localStreaming.style.display = '';
    })
    /* localVideo.srcObject = sharedScreen;
    const senders = peerConnection.getSenders();
    const auxVideo = senders.find(sender => sender.track.kind == 'video');
    const auxAudio = senders.find(sender => sender.track.kind == 'audio');
    await auxVideo.replaceTrack(sharedScreen.getVideoTracks()[0]);
    await auxAudio.replaceTrack(sharedScreen.getAudioTracks()[0]);

    sharedScreen.getVideoTracks()[0].addEventListener('ended', async() => {
        localVideo.srcObject = localStream;
        const senders = peerConnection.getSenders();
        const auxVideo = senders.find(sender => sender.track.kind == 'video');
        const auxAudio = senders.find(sender => sender.track.kind == 'audio');
        await auxVideo.replaceTrack(localStream.getVideoTracks()[0]);
        await auxAudio.replaceTrack(localStream.getAudioTracks()[0]);
    }) */
}