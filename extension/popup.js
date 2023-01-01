document.getElementById("button").addEventListener('click', () => {
    console.log('fishy did not screw up: ', new Date());
    browser.storage.local.set({isIntervalSet: true})
    browser.storage.local.set({startTime: new Date()})
    browser.storage.local.set({ timeToBlock: 1 * 60000 })
})