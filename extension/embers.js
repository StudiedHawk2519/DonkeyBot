(function () {
    chrome.storage.local.get({ embers_enabled: true }, (data) => {
        if (data.embers_enabled) {
            const script = document.createElement('script');
            script.src = chrome.runtime.getURL('embers_inject.js');
            (document.head || document.documentElement).appendChild(script);
        }
    });
})();