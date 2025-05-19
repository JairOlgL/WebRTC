document.getElementById('camara').onclick = () => {
    localStream.getVideoTracks()[0].enabled = !localStream.getVideoTracks()[0].enabled;
}
document.getElementById('mute').onclick = () => {
    localStream.getAudioTracks()[0].enabled = !localStream.getAudioTracks()[0].enabled;
}
document.getElementById('compartir').onclick = async() => {
    const sharedScreen = await navigator.mediaDevices.getDisplayMedia({
        video: {cursor: 'always'},
        audio: true
    })
    localVideo.srcObject = sharedScreen;
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
    })
}