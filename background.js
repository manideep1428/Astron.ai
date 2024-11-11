chrome.runtime.onInstalled.addListener(() => {
    console.log('Text Helper Extension installed');
});

chrome.action.onClicked.addListener((tab) => {
    if (tab.url?.startsWith('chrome://')) return;
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
    });
});