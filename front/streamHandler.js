document.getElementById('camara').onclick = () => {
    localStream.getVideoTracks()[0].enabled = !localStream.getVideoTracks()[0].enabled;
}
document.getElementById('mute').onclick = () => {
    localStream.getAudioTracks()[0].enabled = !localStream.getAudioTracks()[0].enabled;
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
            channelCount: 2,           // Estéreo
            sampleRate: 48000,         // 48 kHz (calidad estudio)
            sampleSize: 24,            // 24 bits por muestra
            volume: 1.0,               // Volumen máximo
            autoGainControl: false,    // ¡Crítico! Desactiva normalización automática
            noiseSuppression: false,   // Desactiva filtros de voz
            echoCancellation: false    // Evita procesamiento adicional
        }
    })
    peerConnection.addTrack(sharedScreen.getVideoTracks()[0], sharedScreen);
    peerConnection.addTrack(sharedScreen.getAudioTracks()[0], sharedScreen);
    localVideo.style.gridColumn = '1/2';
    document.getElementById('localStreaming').style.display = 'block';
    document.getElementById('localStreaming').srcObject = sharedScreen;
    sharedScreen.getVideoTracks()[0].addEventListener('ended', event => {
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