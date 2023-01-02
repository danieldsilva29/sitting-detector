document.getElementById("button").addEventListener('click', () => {
    console.log('fishy did not screw up: ', new Date());
    const browser = chrome;

    chrome.tabs.create({ url: "./request.html" }, tab => {})

    browser.storage.local.set({isIntervalSet: true}).then(() => browser.storage.local.get('isIntervalSet', ({ isIntervalSet  }) => console.log(isIntervalSet)))
    browser.storage.local.set({startTime: (new Date()).getTime()})
    browser.storage.local.set({ timeToBlock: 1000 })
})