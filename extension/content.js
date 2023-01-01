console.log("content script or dog");
async function getMedia(video, canvas) {
    const width = 320;
    const height = 0;
    const streaming = false;

    console.log("Inside getMedia")

    try {
        let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        video.srcObject = stream;
        video.play();
    } catch (err) {
        console.error(`An exception occured: ${error}`);
    }
    video.addEventListener("canplay", event => {
        console.log("canplay")
        if (!streaming) {
            height = (video.videoHeight / video.videoWidth) * innerWidth;

            video.setAttribute("width", width);
            video.setAttribute("height", height);
            canvas.setAttribute("width", width);
            canvas.setAttribute("height", height);
            streaming = true;
        }
    });
    const context = canvas.getContext('2d');
    while (!(width && height)) {}
    canvas.width = width;
    canvas.height = height;
    const facePresent = context.drawImage(video, 0, 0, width, height);

    const data = canvas.toDataURL("image/png");
    const resp = await fetch("http://localhost:8000/video", {
        method: 'POST',
        body: data
    });
    const d = resp.json()
    return d.message;
}

const browser = chrome;
browser.runtime.connect();
console.log("browser runtime connected idk")
browser.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    console.log("msg: ", msg.message)
    alert(msg.message);
    if (msg.message !== 'begin_check') return;
    const div = document.createElement('div');
    div.setAttribute('style', 'visibility:none');

    const video = document.createElement('video');
    div.appendChild(video);

    const canvas = document.createElement('canvas');
    div.appendChild(canvas);

    document.body.appendChild(div);
    //create a script tag to inject, then set a variable with the id in that script
    // let idScript = document.createElement("script");
    // idScript.setAttribute("type", "application/javascript");
    // idScript.textContent = 'var myExtId = "' + chrome.runtime.id +'";';
    // let parent = ( document.head || document.documentElement );
    // parent.insertBefore( idScript, parent.firstChild );

    // const myExtId = chrome.runtime.id;

    //inject and run your other script here
    getMedia(video, canvas)
        .then(should_close => browser.runtime.sendMessage({'should_close': should_close}))
        .then(() => document.removeChild(div));

    //idScript.remove(); //then cleanup 

    console.log("content script pog")

    // getMedia(video, canvas)
    //     .then(should_close => browser.runtime.sendMessage(chrome.runtime.id, {'should_close': should_close})) // get a response 
    //     .then(() => document.removeChild(div));
})