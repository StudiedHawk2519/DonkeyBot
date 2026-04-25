(function () {
    const THEME = {
        accent: "#7d848c",
        bg: "rgb(51, 51, 51)",
        active: "rgb(11, 172, 254)",
        hover: "rgb(11, 172, 254)"
    };

    function applyTheme() {
        chrome.storage.local.get(['decade_nav_color'], (data) => {
            if (!data.decade_nav_color) return;

            // Target the specific sidebar container class from your screenshot
            const sidebar = document.querySelector(".rc-app-frame__menu");
            if (sidebar) {
                sidebar.style.backgroundColor = data.decade_nav_color;
                sidebar.style.setProperty('--main-menu-bg', data.decade_nav_color);
            }

            // XPath fallback for /html/body/div[2]/div[1]/div[1]
            const path = "/html/body/div[2]/div[1]/div[1]";
            const targetDiv = document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (targetDiv) {
                targetDiv.style.backgroundColor = data.decade_nav_color;
            }
        });
    }
    setInterval(applyTheme, 1000);

    function resetBtn() {
        const btn = document.getElementById('decade-ai-btn');
        const btnText = document.getElementById('decade-btn-text');
        if (btn) {
            btn.dataset.state = "idle";
            btn.style.background = "transparent";
            btn.style.borderColor = THEME.accent;
            btnText.style.color = THEME.accent;
        }
    }

    function createBubbleOverlay() {
        if (document.getElementById('decade-bubble')) return;
        const bubble = document.createElement('div');
        bubble.id = "decade-bubble";
        bubble.style = `
            display: none; position: fixed; background: ${THEME.bg}; color: white; 
            border: 2px solid ${THEME.active}; border-radius: 12px; padding: 18px; 
            box-shadow: 0 10px 40px rgba(0,0,0,0.6); z-index: 2147483647; 
            width: 260px; pointer-events: auto; font-family: 'Poppins', sans-serif;
            opacity: 0; transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            transform: translateX(-10px);
        `;
        bubble.innerHTML = `
            <div id="decade-bubble-close" style="position: absolute; top: 8px; right: 10px; cursor: pointer; color: ${THEME.active}; font-size: 18px; font-weight: bold; line-height: 1;">&times;</div>
            <div id="decade-bubble-answer" style="font-weight: 400; color: white; font-size: 15px; line-height: 1.4; word-wrap: break-word;">Ready...</div>
            <div style="position: absolute; left: -12px; top: 15px; width: 0; height: 0; border-top: 12px solid transparent; border-bottom: 12px solid transparent; border-right: 12px solid ${THEME.active};"></div>
        `;
        document.body.appendChild(bubble);
        document.getElementById('decade-bubble-close').onclick = () => {
            bubble.style.opacity = "0";
            setTimeout(() => { bubble.style.display = "none"; }, 300);
            resetBtn();
        };
    }

    function injectSidebarButton() {
        if (document.getElementById('decade-sidebar-item')) return;
        createBubbleOverlay();
        const sidebar = document.evaluate("/html/body/div[2]/div[1]/div[1]/nav/ul", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (!sidebar) return;

        const li = document.createElement('li');
        li.id = "decade-sidebar-item";
        li.style = "margin: 10px 0; list-style: none; display: flex; justify-content: center;";
        li.innerHTML = `<div id="decade-ai-btn" data-state="idle" style="cursor: pointer; background: transparent; border: 2px solid ${THEME.accent}; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;"><span id="decade-btn-text" style="color: ${THEME.accent}; font-weight: bold; font-size: 10px; font-family: sans-serif;">AI</span></div>`;
        sidebar.appendChild(li);

        const btn = document.getElementById('decade-ai-btn');
        const bubble = document.getElementById('decade-bubble');

        btn.onclick = (e) => {
            e.stopPropagation();
            if (btn.dataset.state === "working") return;
            if (bubble.style.display === "block") {
                bubble.style.opacity = "0";
                setTimeout(() => { bubble.style.display = "none"; }, 300);
                return;
            }
            const rect = btn.getBoundingClientRect();
            bubble.style.top = (rect.top - 5) + "px";
            bubble.style.left = (rect.right + 20) + "px";
            bubble.style.display = "block";
            setTimeout(() => { bubble.style.opacity = "1"; bubble.style.transform = "translateX(0px)"; }, 10);

            btn.dataset.state = "working";
            btn.style.background = THEME.active;
            btn.style.borderColor = THEME.active;
            document.getElementById('decade-btn-text').style.color = "#ffffff";
            document.getElementById('decade-bubble-answer').innerHTML = "Thinking...";

            const el = document.evaluate("/html/body/div[2]/div[1]/div[2]/div/div/div/div[1]/div[2]/div/div", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            window.postMessage({ type: "DECADE_ASK_AI", text: el ? el.innerText : "Question not found." }, "*");
        };
    }

    window.addEventListener("message", (e) => {
        if (e.data.type === "DECADE_AI_RES") {
            resetBtn();
            const ansDiv = document.getElementById('decade-bubble-answer');
            if (ansDiv) {
                const match = e.data.answer.match(/<answer>([\s\S]*?)<\/answer>/i);
                ansDiv.innerText = match ? match[1].trim() : e.data.answer.trim();
            }
        }
    });

    new MutationObserver(() => injectSidebarButton()).observe(document.body, { childList: true, subtree: true });
    injectSidebarButton();
})();