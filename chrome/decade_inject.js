(function () {
    const THEME = {
        accent: "#7d848c",
        bg: "rgb(51, 51, 51)",
        active: "rgb(11, 172, 254)",
        hover: "rgb(11, 172, 254)"
    };

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
        // Added transition and opacity for fading
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

        document.getElementById('decade-bubble-close').onclick = () => hideBubble();
    }

    function showBubble(rect) {
        const bubble = document.getElementById('decade-bubble');
        bubble.style.top = (rect.top - 5) + "px";
        bubble.style.left = (rect.right + 20) + "px";
        bubble.style.display = "block";
        // Trigger reflow for animation
        setTimeout(() => {
            bubble.style.opacity = "1";
            bubble.style.transform = "translateX(0px)";
        }, 10);
    }

    function hideBubble() {
        const bubble = document.getElementById('decade-bubble');
        bubble.style.opacity = "0";
        bubble.style.transform = "translateX(-10px)";
        setTimeout(() => { bubble.style.display = "none"; }, 300);
        resetBtn();
    }

    function injectSidebarButton() {
        if (document.getElementById('decade-sidebar-item')) return;
        createBubbleOverlay();

        const sidebarPath = "/html/body/div[2]/div[1]/div[1]/nav/ul";
        const sidebar = document.evaluate(sidebarPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (!sidebar) return;

        const li = document.createElement('li');
        li.id = "decade-sidebar-item";
        li.style = "margin: 10px 0; list-style: none; display: flex; justify-content: center;";

        li.innerHTML = `
            <div id="decade-ai-btn" data-state="idle" style="cursor: pointer; background: transparent; border: 2px solid ${THEME.accent}; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;">
                <span id="decade-btn-text" style="color: ${THEME.accent}; font-weight: bold; font-size: 10px; font-family: sans-serif; transition: color 0.3s ease;">AI</span>
            </div>
        `;
        sidebar.appendChild(li);

        const btn = document.getElementById('decade-ai-btn');
        const btnText = document.getElementById('decade-btn-text');
        const bubble = document.getElementById('decade-bubble');

        btn.onmouseenter = () => {
            if (btn.dataset.state !== "working") {
                btn.style.borderColor = THEME.hover;
                btnText.style.color = THEME.hover;
            }
        };
        btn.onmouseleave = () => {
            if (btn.dataset.state !== "working") {
                btn.style.borderColor = THEME.accent;
                btnText.style.color = THEME.accent;
            }
        };

        btn.onclick = (e) => {
            e.stopPropagation();
            if (btn.dataset.state === "working") return;

            if (bubble.style.display === "block" && bubble.style.opacity === "1") {
                hideBubble();
                return;
            }

            const rect = btn.getBoundingClientRect();
            showBubble(rect);

            btn.dataset.state = "working";
            btn.style.background = THEME.active;
            btn.style.borderColor = THEME.active;
            btnText.style.color = "#ffffff";

            document.getElementById('decade-bubble-answer').innerHTML = `<span style="color: ${THEME.active}">Thinking...</span>`;

            const qPath = "/html/body/div[2]/div[1]/div[2]/div/div/div/div[1]/div[2]/div/div";
            const el = document.evaluate(qPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            window.postMessage({ type: "DECADE_ASK_AI", text: el ? el.innerText : "Question not found." }, "*");
        };
    }

    window.addEventListener("message", (e) => {
        if (e.data.type === "DECADE_AI_RES") {
            const btn = document.getElementById('decade-ai-btn');
            const btnText = document.getElementById('decade-btn-text');
            const ansDiv = document.getElementById('decade-bubble-answer');

            if (btn) {
                btn.dataset.state = "idle";
                btn.style.background = "transparent";
                btn.style.borderColor = THEME.accent;
                btnText.style.color = THEME.accent;
            }

            if (ansDiv) {
                const match = e.data.answer.match(/<answer>([\s\S]*?)<\/answer>/i);
                ansDiv.innerText = match ? match[1].trim() : e.data.answer.trim();
            }
        }
    });

    const observer = new MutationObserver(() => injectSidebarButton());
    observer.observe(document.body, { childList: true, subtree: true });
    injectSidebarButton();
})();