document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('ln-toggle');

    // Load saved state (defaulting to enabled)
    chrome.storage.local.get({ languagenot_enabled: true }, (data) => {
        toggle.checked = data.languagenot_enabled;
    });

    // Save state when toggled
    toggle.addEventListener('change', () => {
        chrome.storage.local.set({ languagenot_enabled: toggle.checked });
    });
});