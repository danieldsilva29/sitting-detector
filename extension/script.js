document.addEventListener('DOMContentLoaded', () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false }, () => {
        console.log("I think i got the permissions pog")
    })
})

chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
    let image
    console.log("onmessage addlistener") 
    if(request!='getData') return;
    navigator.mediaDevices.getUserMedia({video: true, audio: false}).then(async stream => {
        const track = stream.getVideoTracks()[0]
        imagestream = new ImageCapture(track)
        image = await imagestream.takePhoto()
        console.log(image)
        let reader = new FileReader()
        reader.readAsDataURL(image)
        reader.onloadend = function() {
            console.log("loading ended")
            image = reader.result.split(",")[1]
            console.log(image)
            fetch("http://localhost:8000/video", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({uri: image}),
            }).then(response => response.json())
                .then(res => {
                    console.log(res)
                    msg = res.uri
                    if(res.uri=="1") {
                        chrome.storage.local.set({isBlocked: true})
                    }
                })
        }
    })
})

// move the access requirement to popup.js
// attempt to access the image and send to backend lets go