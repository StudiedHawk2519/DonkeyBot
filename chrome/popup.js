document.addEventListener('DOMContentLoaded', () => {
    const lnToggle = document.getElementById('ln-toggle');
    const decadeToggle = document.getElementById('decade-toggle');
    const apiKeyInput = document.getElementById('decade-api-key');

    chrome.storage.local.get({
        languagenot_enabled: true,
        decade_enabled: true,
        decade_api_key: ''
    }, (data) => {
        lnToggle.checked = data.languagenot_enabled;
        decadeToggle.checked = data.decade_enabled;
        apiKeyInput.value = data.decade_api_key;
    });

    lnToggle.addEventListener('change', () => chrome.storage.local.set({ languagenot_enabled: lnToggle.checked }));
    decadeToggle.addEventListener('change', () => chrome.storage.local.set({ decade_enabled: decadeToggle.checked }));
    apiKeyInput.addEventListener('input', () => chrome.storage.local.set({ decade_api_key: apiKeyInput.value }));
});