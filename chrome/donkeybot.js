(function () {
    const applyNameSettings = (data) => {
        const root = document.documentElement;
        root.dataset.donkeybotNameEnabled = data.donkeybot_name_enabled ? 'true' : 'false';
        root.dataset.donkeybotName = data.donkeybot_name || '';
    };

    chrome.storage.local.get({
        donkeybot_enabled: true,
        donkeybot_name_enabled: false,
        donkeybot_name: '',
        donkeybot_timer_enabled: true
    }, (data) => {
        applyNameSettings(data);
        document.documentElement.dataset.donkeybotTimerEnabled = data.donkeybot_timer_enabled === false ? 'false' : 'true';
        if (data.donkeybot_enabled) {
            const script = document.createElement('script');
            script.src = chrome.runtime.getURL('donkeybot_inject.js');
            (document.head || document.documentElement).appendChild(script);
        }
    });

    chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName !== 'local') return;
        const nameEnabled = changes.donkeybot_name_enabled;
        const name = changes.donkeybot_name;
        const timerEnabled = changes.donkeybot_timer_enabled;
        if (!nameEnabled && !name && !timerEnabled) return;

        const current = {
            donkeybot_name_enabled: nameEnabled ? nameEnabled.newValue : document.documentElement.dataset.donkeybotNameEnabled === 'true',
            donkeybot_name: name ? name.newValue : document.documentElement.dataset.donkeybotName || ''
        };
        applyNameSettings(current);
        if (timerEnabled) {
            document.documentElement.dataset.donkeybotTimerEnabled = timerEnabled.newValue === false ? 'false' : 'true';
        }
        document.dispatchEvent(new CustomEvent('donkeybot-name-settings-changed'));
    });
})();