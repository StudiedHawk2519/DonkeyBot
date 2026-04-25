document.addEventListener('DOMContentLoaded', () => {
    const lnToggle = document.getElementById('ln-toggle');
    const decadeToggle = document.getElementById('decade-toggle');
    const apiKeyInput = document.getElementById('decade-api-key');
    const navColorInput = document.getElementById('decade-nav-color');
    const dots = document.querySelectorAll('.color-dot');

    chrome.storage.local.get({
        languagenot_enabled: true,
        decade_enabled: true,
        decade_api_key: '',
        decade_nav_color: '#1a2a3a'
    }, (data) => {
        lnToggle.checked = data.languagenot_enabled;
        decadeToggle.checked = data.decade_enabled;
        apiKeyInput.value = data.decade_api_key;
        navColorInput.value = data.decade_nav_color;
    });

    lnToggle.addEventListener('change', () => chrome.storage.local.set({ languagenot_enabled: lnToggle.checked }));
    decadeToggle.addEventListener('change', () => chrome.storage.local.set({ decade_enabled: decadeToggle.checked }));
    apiKeyInput.addEventListener('input', () => chrome.storage.local.set({ decade_api_key: apiKeyInput.value }));

    // Hex text input logic
    navColorInput.addEventListener('input', () => {
        const color = navColorInput.value;
        if (/^#[0-9A-F]{6}$/i.test(color)) {
            chrome.storage.local.set({ decade_nav_color: color });
        }
    });

    // Preset dots logic
    dots.forEach(dot => {
        dot.onclick = () => {
            const color = dot.getAttribute('data-color');
            navColorInput.value = color;
            chrome.storage.local.set({ decade_nav_color: color });
        };
    });
});