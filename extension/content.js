// content.js
chrome.storage.local.get({ languagenot_enabled: true }, (data) => {
    if (data.languagenot_enabled) {
        // Create a script element that points to our local inject.js file
        const script = document.createElement('script');
        script.src = chrome.runtime.getURL('inject.js');

        // Ensure the script removes itself after loading to keep the DOM clean
        script.onload = function () {
            this.remove();
        };

        (document.head || document.documentElement).appendChild(script);
    }
});