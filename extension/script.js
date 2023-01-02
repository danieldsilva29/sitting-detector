document.addEventListener('DOMContentLoaded', () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false }, () => {
        console.log("I think i got the permissions pog")
    })
})

// move the access requirement to popup.js
// attempt to access the image and send to backend lets go