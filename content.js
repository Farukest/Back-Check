chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "NEW_SITE") {
        alert(`Bu siteyi ilk kez ziyaret ediyorsunuz: ${message.site}`);
    }
});
