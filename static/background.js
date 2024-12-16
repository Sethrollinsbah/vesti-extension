// background.js

let lastImageSrc = null;

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'sendImageSrc') {
    lastImageSrc = message.src;
    sendResponse({ status: 'Image src received' });
  }
});

// Allow the popup to retrieve the last clicked image src
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getLastImageSrc') {
    sendResponse({ src: lastImageSrc });
  }
});

function openPopup() {
  chrome.windows.create({
    url: chrome.runtime.getURL('index.html'),  // The URL to your SvelteKit popup
    type: 'popup',
    width: 400,
    height: 500,
    focused: true,
  });
}

// Listen for events to open the popup
chrome.action.onClicked.addListener(() => {
  openPopup();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'openPopup') {
    openPopup();
  }
});
