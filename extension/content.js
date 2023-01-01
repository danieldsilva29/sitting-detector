
import { getMedia  } from "./logic";
browser.runtime.onMessage.addListener((msg, sender) => {
    alert(msg);
    if (msg !== 'begin_check') return;
    const div = document.createElement('div');
    div.setAttribute('style', 'visibility:none');

    const video = document.createElement('video');
    div.appendChild(video);

    const canvas = document.createElement('canvas');
    div.appendChild(canvas);

    getMedia(video, canvas)
        .then(should_close => browser.extension.sendRequest({'should_close': should_close}))
        .then(() => document.removeChild(div));
})