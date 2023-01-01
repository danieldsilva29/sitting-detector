
browser.runtime.onInstalled.addListener(function() {
    browser.storage.local.set({isBlocked: false}).then(() => console.log("asdfasdf"))
    browser.storage.local.set({isIntervalSet: false})
    browser.storage.local.set({timeToBlock: null}).then(() => console.log("woeijfowiejfo")) //in minutes
    browser.storage.local.set({startTime: null})
})

function cleanup() {
    browser.storage.local.set({isIntervalSet: false})
    browser.storage.local.set({timeToBlock: null}).then(() => console.log("woeijfowiejfo")) //in minutes
    browser.storage.local.set({startTime: null})
}

function closeAllTabs() {
    let querying = browser.tabs.query({}, (tabs) => {
        for (let tab of tabs) {
            browser.tabs.remove(tab.id);
        }
    });
}

async function x() {
    console.log('fishy was here');
    const { isBlocked } = await browser.storage.local.get('isBlocked');
    if ( isBlocked ) browser.runtime.sendMessage('begin_check');
    else {
        const { isIntervalSet } = await browser.storage.local.get('isIntervalSet');
        if (isIntervalSet)  {
            const { startTime } = await browser.storage.local.get('startTime');
            const { timeToBlock } = await browser.storage.local.get('timeToBlock');
            
            const currentDate = new Date();
            const diff = (currentDate - startTime);

            if(diff >= timeToBlock) {
                await browser.runtime.sendMessage('begin_check');
                browser.storage.local.set({'isBlocked': true});
                cleanup();
            }
        }
    }
}

setInterval(x, 2000);


browser.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
    x();
});

browser.runtime.onMessage.addListener((msg, sender) => {
    if (msg['should_close']) {
        browser.storage.local.set({ isBlocked: true })
        closeAllTabs();
    }
})



