document.addEventListener('DOMContentLoaded', () => {
    navigator.mediaDevices.getUserMedia({video: true, audio: false}, (stream) => {
        console.log(stream)
    })
})