document.addEventListener('DOMContentLoaded', () => {
    const donkeybotToggle = document.getElementById('donkeybot-toggle');
    const apiKeyInput = document.getElementById('llm7-api-key');
    const nameToggle = document.getElementById('donkeybot-name-toggle');
    const nameInput = document.getElementById('donkeybot-name');
    const timerToggle = document.getElementById('donkeybot-timer-toggle');
    const storage = globalThis.chrome && globalThis.chrome.storage ? globalThis.chrome.storage.local : null;

    if (!storage) {
        return;
    }

    storage.get({
        donkeybot_enabled: true,
        llm7_api_key: '',
        donkeybot_name_enabled: false,
        donkeybot_name: '',
        donkeybot_timer_enabled: true
    }, (data) => {
        if (donkeybotToggle) donkeybotToggle.checked = !!(data && data.donkeybot_enabled !== undefined ? data.donkeybot_enabled : true);
        if (apiKeyInput) apiKeyInput.value = data && data.llm7_api_key ? data.llm7_api_key : '';
        if (nameToggle) nameToggle.checked = !!(data && data.donkeybot_name_enabled);
        if (nameInput) nameInput.value = data && data.donkeybot_name ? data.donkeybot_name : '';
        if (timerToggle) timerToggle.checked = data && data.donkeybot_timer_enabled !== false;
    });

    if (donkeybotToggle) {
        donkeybotToggle.addEventListener('change', () => {
            storage.set({ donkeybot_enabled: donkeybotToggle.checked });
        });
    }

    if (apiKeyInput) {
        apiKeyInput.addEventListener('input', () => {
            storage.set({ llm7_api_key: apiKeyInput.value });
        });
    }

    if (nameToggle) {
        nameToggle.addEventListener('change', () => {
            storage.set({ donkeybot_name_enabled: nameToggle.checked });
        });
    }

    if (nameInput) {
        nameInput.addEventListener('input', () => {
            storage.set({ donkeybot_name: nameInput.value });
        });
    }

    if (timerToggle) {
        timerToggle.addEventListener('change', () => {
            storage.set({ donkeybot_timer_enabled: timerToggle.checked });
        });
    }
});