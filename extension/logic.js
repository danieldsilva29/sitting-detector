export async function getMedia(video, canvas) {
    const width = 320;
    const height = 0;
    const streaming = false;

    try {
        let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        video.srcObject = stream;
        video.play();
    } catch (err) {
        console.error(`An exception occured: ${error}`);
    }
    video.addEventListener("canplay", event => {
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
    const resp = await fetch("/video", {
        method: 'POST',
        body: data
    });
    const d = resp.json()
    return d.message;
}