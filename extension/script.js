document.addEventListener('DOMContentLoaded', () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false }, () => {
        console.log("I think i got the permissions pog")
    })
})