
const browser = chrome;
browser.runtime.onInstalled.addListener(function() {
    chrome.storage.local.set({isBlocked: false}, () => console.log("dogshaan"))
    browser.storage.local.set({isIntervalSet: false})
    browser.storage.local.set({timeToBlock: null}, () => console.log("woeijfowiejfo")) //in minutes
    browser.storage.local.set({startTime: null})
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

function requestBackend() {
    navigator.mediaDevices.getUserMedia({video: true, audio: false}, function(stream) {
        console.log(stream)
    })
}

function getPermission() {
    chrome.tabs.create({ url: "./request.html" }, tab => {
        // chrome.scripting.executeScript({
        //     target: { tabId: tab.id },
        //     files: ['script.js'],
        // })
        //chrome.tabs.remove(tab.id)
    })
}

async function x() {
    if(!shouldContinue) return;
    const browser = chrome;
    console.log('fishy was here');
    const { isBlocked } = await browser.storage.local.get('isBlocked');
    if ( isBlocked ) {
        shouldContinue = false
        console.log("is blocked is true")
        getPermission();
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
                getPermission();
                console.log("complete permission")  
                //cleanup();
            }
        }
    }
}

setInterval(x, 2000);


// browser.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
//     x();
// });

browser.runtime.onMessageExternal.addListener((msg, sender, sendResponse) => {
    if (msg['should_close']) {
        browser.storage.local.set({ isBlocked: true })
        closeAllTabs();
    }
})



