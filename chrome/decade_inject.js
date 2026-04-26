(function () {
    const THEME = {
        bg: "rgba(40, 50, 70, 0.85)",
        blur: "blur(12px)",
        accent: "#7d848c",
        highlight: "rgb(11, 172, 254)",
        border: "rgba(255, 255, 255, 0.1)",
        shadow: "0 10px 30px rgba(0,0,0,0.4)"
    };

    // Add pulsing animation for loading state
    const style = document.createElement('style');
    style.textContent = `
        @keyframes decade-pulse {
            0% { border-left-color: ${THEME.highlight}; opacity: 1; }
            50% { border-left-color: rgba(11, 172, 254, 0.4); opacity: 0.7; }
            100% { border-left-color: ${THEME.highlight}; opacity: 1; }
        }
        .decade-loading {
            animation: decade-pulse 1.5s infinite ease-in-out;
        }
        #decade-ai-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 0 12px rgba(11, 172, 254, 0.3);
            background: rgba(11, 172, 254, 0.1) !important;
            border-color: ${THEME.highlight} !important;
        }
        #decade-ai-btn:hover #decade-btn-text {
            color: ${THEME.highlight} !important;
        }
    `;
    document.head.appendChild(style);

    function createBubbleOverlay() {
        if (document.getElementById('decade-bubble')) return;

        const bubble = document.createElement('div');
        bubble.id = "decade-bubble";
        bubble.style = `
            position: fixed; 
            z-index: 2147483647; 
            font-family: 'Poppins', sans-serif; 
            background: ${THEME.bg}; 
            backdrop-filter: ${THEME.blur};
            -webkit-backdrop-filter: ${THEME.blur};
            color: white; 
            border: 1px solid ${THEME.border}; 
            border-radius: 12px; 
            padding: 0; 
            box-shadow: ${THEME.shadow}; 
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
            display: none;
            opacity: 0;
            width: 240px;
            overflow: hidden;
        `;

        bubble.innerHTML = `
            <div style="background: rgba(255,255,255,0.05); padding: 10px 12px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1);">
                <div style="display: flex; align-items: center; gap: 6px;">
                    <span style="font-size: 12px; font-weight: 700; letter-spacing: 0.5px; color: #fff;">DECADE</span>
                </div>
                <div id="decade-bubble-close" style="cursor: pointer; opacity: 0.6; font-size: 18px; line-height: 1;">&times;</div>
            </div>
            <div style="padding: 15px;">
                <div id="decade-bubble-answer" style="font-size: 13px; line-height: 1.4; color: #ffffff; min-height: 20px; font-weight: 500; background: rgba(0,0,0,0.2); padding: 10px 12px; border-radius: 4px; border-left: 3px solid ${THEME.highlight};">
                    Ready...
                </div>
            </div>
            <div style="position: absolute; left: -5px; top: 20px; width: 10px; height: 10px; background: rgba(45, 55, 75, 0.9); border-left: 1px solid ${THEME.border}; border-bottom: 1px solid ${THEME.border}; transform: rotate(45deg); z-index: -1;"></div>
        `;

        document.body.appendChild(bubble);
        document.getElementById('decade-bubble-close').onclick = (e) => {
            e.stopPropagation();
            hideBubble();
        };
    }

    function hideBubble() {
        const bubble = document.getElementById('decade-bubble');
        if (!bubble || bubble.style.display === "none") return;
        bubble.style.opacity = "0";
        bubble.style.transform = "translateX(10px)";
        setTimeout(() => { bubble.style.display = "none"; }, 400);
        resetBtn();
    }

    // Auto-hide logic: Click anywhere outside to close
    document.addEventListener('click', (e) => {
        const bubble = document.getElementById('decade-bubble');
        const btn = document.getElementById('decade-ai-btn');
        if (bubble && !bubble.contains(e.target) && btn && !btn.contains(e.target)) {
            hideBubble();
        }
    });

    function resetBtn() {
        const btn = document.getElementById('decade-ai-btn');
        const btnText = document.getElementById('decade-btn-text');
        const ansDiv = document.getElementById('decade-bubble-answer');
        if (btn) {
            btn.dataset.state = "idle";
            btn.style.background = "transparent";
            btn.style.borderColor = THEME.accent;
            btnText.style.color = THEME.accent;
        }
        if (ansDiv) ansDiv.classList.remove('decade-loading');
    }

    function injectSidebarButton() {
        if (document.getElementById('decade-sidebar-item')) return;
        createBubbleOverlay();
        const navUl = document.evaluate("/html/body/div[2]/div[1]/div[1]/nav/ul", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (!navUl) return;

        const li = document.createElement('li');
        li.id = "decade-sidebar-item";
        li.style = "margin: 15px 0; list-style: none; display: flex; justify-content: center;";
        li.innerHTML = `<div id="decade-ai-btn" data-state="idle" style="cursor: pointer; background: transparent; border: 2px solid ${THEME.accent}; width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;"><span id="decade-btn-text" style="color: ${THEME.accent}; font-weight: bold; font-size: 11px; transition: color 0.3s ease;">AI</span></div>`;
        navUl.appendChild(li);

        const btn = document.getElementById('decade-ai-btn');
        btn.onclick = (e) => {
            e.stopPropagation();
            const bubble = document.getElementById('decade-bubble');
            const rect = btn.getBoundingClientRect();

            bubble.style.display = "block";
            bubble.style.top = (rect.top - 8) + "px";
            bubble.style.left = (rect.right + 18) + "px";

            setTimeout(() => {
                bubble.style.opacity = "1";
                bubble.style.transform = "translateX(0)";
            }, 10);

            btn.dataset.state = "working";
            btn.style.background = THEME.highlight;
            btn.style.borderColor = THEME.highlight;
            document.getElementById('decade-btn-text').style.color = "#ffffff";

            const ansDiv = document.getElementById('decade-bubble-answer');
            ansDiv.innerHTML = `<span style="opacity: 0.5;">Thinking...</span>`;
            ansDiv.classList.add('decade-loading');

            const el = document.evaluate("/html/body/div[2]/div[1]/div[2]/div/div/div/div[1]/div[2]/div/div", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            window.postMessage({ type: "DECADE_ASK_AI", text: el ? el.innerText : "Question not found." }, "*");
        };
    }

    window.addEventListener("message", (e) => {
        if (e.data.type === "DECADE_AI_RES") {
            resetBtn();
            const ansDiv = document.getElementById('decade-bubble-answer');
            if (ansDiv) {
                ansDiv.classList.remove('decade-loading');
                const match = e.data.answer.match(/<answer>([\s\S]*?)<\/answer>/i);
                ansDiv.innerText = match ? match[1].trim() : e.data.answer.trim();
            }
        }
    });

    new MutationObserver(() => injectSidebarButton()).observe(document.body, { childList: true, subtree: true });
    injectSidebarButton();
})();