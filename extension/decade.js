chrome.storage.local.get({ decade_enabled: true }, (data) => {
    if (data.decade_enabled) {
        const inject = () => {
            if (document.getElementById('decade-sidebar-item')) return;
            const script = document.createElement('script');
            script.src = chrome.runtime.getURL('decade_inject.js');
            (document.head || document.documentElement).appendChild(script);
        };
        inject();
        // Fallback for SPA navigation
        window.addEventListener('load', inject);
    }
});

// The API listener stays the same as your working version
window.addEventListener("message", async (event) => {
    if (event.source !== window || event.data.type !== "DECADE_ASK_AI") return;
    const { decade_api_key } = await chrome.storage.local.get({ decade_api_key: 'unused' });
    try {
        const response = await fetch("https://api.llm7.io/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${decade_api_key}` },
            body: JSON.stringify({
                model: "default",
                messages: [
                    { role: "system", content: "You are an expert tutor. You have been given the html of a homework question and need to determine the correct answer. Sometimes it may contain options. Always return a brief final answer in <answer> tags." },
                    { role: "user", content: event.data.text }
                ]
            })
        });
        const result = await response.json();
        window.postMessage({ type: "DECADE_AI_RES", answer: result.choices[0].message.content }, "*");
    } catch (err) {
        window.postMessage({ type: "DECADE_AI_RES", answer: "<answer>Error</answer> API Connection Failed." }, "*");
    }
});