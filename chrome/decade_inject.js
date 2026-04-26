(function () {
    const THEME = {
        bg: "rgba(51, 51, 51, 0.85)", // Semi-transparent version of your grey
        blur: "blur(12px)", // The glassmorphism effect
        accent: "#7d848c",
        highlight: "rgb(11, 172, 254)", // Your blue
        border: "rgba(255, 255, 255, 0.1)",
        shadow: "0 10px 30px rgba(0,0,0,0.4)"
    };

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
            border-radius: 16px; 
            padding: 0; 
            box-shadow: ${THEME.shadow}; 
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
            display: none;
            opacity: 0;
            width: 260px;
            overflow: hidden;
        `;

        bubble.innerHTML = `
            <div style="background: rgba(255,255,255,0.05); padding: 12px 15px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1);">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="background: ${THEME.highlight}; color: white; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 5px;">AI</span>
                    <span style="font-size: 13px; font-weight: 600; letter-spacing: 0.5px; color: #fff;">DECADE</span>
                </div>
                <div id="decade-bubble-close" style="cursor: pointer; opacity: 0.5; font-size: 20px; line-height: 1;">&times;</div>
            </div>
            <div style="padding: 18px;">
                <div style="font-size: 10px; text-transform: uppercase; opacity: 0.5; font-weight: 700; margin-bottom: 4px; color: ${THEME.highlight};">Response</div>
                <div id="decade-bubble-answer" style="font-size: 14px; line-height: 1.5; color: #ffffff; min-height: 20px; font-weight: 500;">
                    Ready...
                </div>
            </div>
            <div style="position: absolute; left: -6px; top: 22px; width: 12px; height: 12px; background: rgba(60, 60, 60, 0.9); border-left: 1px solid ${THEME.border}; border-bottom: 1px solid ${THEME.border}; transform: rotate(45deg); z-index: -1;"></div>
        `;

        document.body.appendChild(bubble);
        document.getElementById('decade-bubble-close').onclick = () => {
            bubble.style.opacity = "0";
            bubble.style.transform = "translateX(10px)";
            setTimeout(() => { bubble.style.display = "none"; }, 400);
            resetBtn();
        };
    }

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

    function injectSidebarButton() {
        if (document.getElementById('decade-sidebar-item')) return;
        createBubbleOverlay();
        const navUl = document.evaluate("/html/body/div[2]/div[1]/div[1]/nav/ul", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (!navUl) return;

        const li = document.createElement('li');
        li.id = "decade-sidebar-item";
        li.style = "margin: 15px 0; list-style: none; display: flex; justify-content: center;";
        li.innerHTML = `<div id="decade-ai-btn" data-state="idle" style="cursor: pointer; background: transparent; border: 2px solid ${THEME.accent}; width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;"><span id="decade-btn-text" style="color: ${THEME.accent}; font-weight: bold; font-size: 11px;">AI</span></div>`;
        navUl.appendChild(li);

        const btn = document.getElementById('decade-ai-btn');
        btn.onclick = (e) => {
            e.stopPropagation();
            const bubble = document.getElementById('decade-bubble');
            const rect = btn.getBoundingClientRect();

            bubble.style.display = "block";
            bubble.style.top = (rect.top - 10) + "px";
            bubble.style.left = (rect.right + 18) + "px";

            setTimeout(() => {
                bubble.style.opacity = "1";
                bubble.style.transform = "translateX(0)";
            }, 10);

            btn.dataset.state = "working";
            btn.style.background = THEME.highlight;
            btn.style.borderColor = THEME.highlight;
            document.getElementById('decade-btn-text').style.color = "#ffffff";
            document.getElementById('decade-bubble-answer').innerHTML = `<span style="opacity: 0.5;">Thinking...</span>`;

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