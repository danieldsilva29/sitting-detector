
const browser = chrome;
browser.runtime.onInstalled.addListener(function() {
    chrome.storage.local.set({isBlocked: false}, () => console.log("dogshaan"))
    browser.storage.local.set({isIntervalSet: false})
    browser.storage.local.set({timeToBlock: null}, () => console.log("woeijfowiejfo")) //in minutes
    browser.storage.local.set({startTime: null})
    browser.storage.local.set({navigator: null})
})

function cleanup() {
    browser.storage.local.set({isIntervalSet: false})
    browser.storage.local.set({timeToBlock: null}, () => console.log("woeijfowiejfo")) //in minutes
    browser.storage.local.set({startTime: null})
}

function closeAllTabs() {
    const browser = chrome;

    let querying = browser.tabs.query({}, (tabs) => {
        for (let tab of tabs) {
            browser.tabs.remove(tab.id);
        }
    });
}

let shouldContinue = true;

function sendMsg() {
    chrome.runtime.connect()
    //chrome.runtime.onConnect.addListener(() => {
        console.log("connected")
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            console.log("tab queried")
            chrome.tabs.sendMessage(tabs[0].id, {message: 'begin_check'}, function(response) {
                console.log("response") 
                console.log(response)
                shouldContinue = false
            })
        })
    //})
    
    browser.storage.local.set({'isBlocked': true});
}

async function requestBackend() {
    chrome.tabs.query({active: true}, async tabs => {
        chrome.tabs.sendMessage(tabs[0].id, 'getData').then(res => {
            console.log(res)
        })
    })
    // navigator.mediaDevices.getUserMedia({video: true, audio: false}, function(stream) {
    //     console.log(stream)
    // }).catch(VidRA.error)
}

async function x() {
    if(!shouldContinue) return;
    const browser = chrome;
    console.log('fishy was here');
    const { isBlocked } = await browser.storage.local.get('isBlocked');
    if ( isBlocked ) {
        shouldContinue = false
        console.log("is blocked is true")
        requestBackend();
        console.log("complete permission")
    }
    else {
        console.log("blocked is false")
        const { isIntervalSet } = await browser.storage.local.get('isIntervalSet');
        if (isIntervalSet)  {
            const { startTime } = await browser.storage.local.get('startTime');
            const { timeToBlock } = await browser.storage.local.get('timeToBlock');
            
            const currentDate = (new Date()).getTime();
            const diff = (currentDate - startTime);

            if(diff >= timeToBlock) {
                shouldContinue = false
                requestBackend();
                console.log("complete permission")  
                //cleanup();
            }
        }
    }
}

async function checkBlocked() {
    const { isBlocked } = await chrome.storage.local.get('isBlocked')
    console.log(isBlocked)
    if(isBlocked){
        browser.tabs.query({}, (tabs) => {
            for (let tab of tabs) {
                browser.tabs.remove(tab.id);
            }
        });
    }
}

setInterval(x, 2000);
setInterval(checkBlocked, 20000)


// browser.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
//     x();
// });

browser.runtime.onMessageExternal.addListener((msg, sender, sendResponse) => {
    if (msg['should_close']) {
        browser.storage.local.set({ isBlocked: true })
        closeAllTabs();
    }
})



