document.addEventListener('DOMContentLoaded', () => {
    const lnToggle = document.getElementById('ln-toggle');
    const decadeToggle = document.getElementById('decade-toggle');
    const embersToggle = document.getElementById('embers-toggle');
    const apiKeyInput = document.getElementById('decade-api-key');

    // Load all settings at once
    chrome.storage.local.get({
        languagenot_enabled: true,
        decade_enabled: true,
        embers_enabled: true,
        decade_api_key: ''
    }, (data) => {
        if (lnToggle) lnToggle.checked = data.languagenot_enabled;
        if (decadeToggle) decadeToggle.checked = data.decade_enabled;
        if (embersToggle) embersToggle.checked = data.embers_enabled;
        if (apiKeyInput) apiKeyInput.value = data.decade_api_key;
    });

    // Event Listeners for saving
    lnToggle.addEventListener('change', () => {
        chrome.storage.local.set({ languagenot_enabled: lnToggle.checked });
    });

    decadeToggle.addEventListener('change', () => {
        chrome.storage.local.set({ decade_enabled: decadeToggle.checked });
    });

    embersToggle.addEventListener('change', () => {
        chrome.storage.local.set({ embers_enabled: embersToggle.checked });
    });

    apiKeyInput.addEventListener('input', () => {
        chrome.storage.local.set({ decade_api_key: apiKeyInput.value });
    });
});