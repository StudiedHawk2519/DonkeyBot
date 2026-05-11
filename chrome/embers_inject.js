(function () {
    let seconds = 0;

    const formatTime = (s) => {
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = s % 60;
        return [h > 0 ? h : null, m, sec]
            .filter(x => x !== null)
            .map(v => v.toString().padStart(2, '0'))
            .join(':');
    };

    setInterval(() => { seconds++; }, 1000);

    // 1. UPDATED STYLESHEET
    if (!document.getElementById('embers-tactile-theme')) {
        const fontLink = document.createElement('link');
        fontLink.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&display=swap';
        fontLink.rel = 'stylesheet';
        document.head.appendChild(fontLink);

        const style = document.createElement('style');
        style.id = 'embers-tactile-theme';
        style.innerHTML = `
            :root {
                --embers-blue: #0066cc;
                --embers-blue-dark: #004a99;
                --panel-dark: #22153d; 
                --panel-border: rgba(255, 255, 255, 0.2);
                --db-ugly: "Comic Sans MS", "Comic Sans", "Comic Neue", cursive;
                --sparx-font: "DM Sans", sans-serif;
            }

            * { -webkit-user-select: text !important; user-select: text !important; }
            
            button[class*="_NotificationsIconContainer_"], 
            button[class*="_MenuButton_"],
            div[class*="_NavBar_"] + div div > button:nth-child(2),
            div[class*="_NavBar_"] + div div > button:nth-child(3) { 
                display: none !important;
            }

            div[class*="_Header_"], div[class*="_NavBar_"] {
                background: var(--panel-dark) !important;
                border-bottom: 2px solid var(--panel-border) !important;
                height: 50px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: space-between !important;
                padding: 0 15px !important;
            }

            /* SCRAPE BUTTON - FIXED CENTER IN HEADER */
            #copy-prompt-btn {
                background: var(--embers-blue) !important;
                color: white !important;
                border: none !important;
                border-bottom: 4px solid var(--embers-blue-dark) !important;
                text-transform: uppercase;
                font-family: var(--db-ugly) !important;
                font-weight: 900 !important;
                border-radius: 12px !important;
                padding: 0 16px !important;
                cursor: pointer !important;
                font-size: 11px !important;
                transition: all 0.1s ease;
                display: inline-flex !important;
                align-items: center;
                justify-content: center;
                height: 32px !important;
                box-sizing: border-box !important;
                /* Positioned fixed to center of screen but top: 9px to stay in header */
                position: fixed !important;
                left: 50% !important;
                top: 9px !important; 
                transform: translateX(-50%) !important;
                z-index: 99999 !important;
            }

            #copy-prompt-btn:active {
                border-bottom-width: 1px !important;
                top: 12px !important;
            }

            #copy-prompt-btn.success-glow {
                background: #28a745 !important;
                border-bottom-color: #1e7e34 !important;
            }

            /* SESSION TIMER - DM SANS */
            #embers-session-timer {
                color: white !important;
                font-family: var(--sparx-font) !important;
                font-size: 15px !important;
                font-weight: 700 !important;
                margin-left: auto !important; 
                user-select: none !important;
                padding-right: 10px;
            }

            .db-logo-pill {
                background: white;
                padding: 4px 12px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        `;
        document.head.appendChild(style);
    }

    const injectEmbers = () => {
        // 2. EMBERS LOGO (Left)
        const logoImg = document.evaluate("/html/body/div[1]/div[2]/div[1]/a/img", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (logoImg && !document.getElementById('embers-logo-svg')) {
            const wrapper = document.createElement('div');
            wrapper.id = 'embers-logo-svg';
            wrapper.style.display = "flex";
            wrapper.innerHTML = `<svg width="140" height="40" viewBox="0 0 140 40" xmlns="http://www.w3.org/2000/svg"><text x="5" y="28" font-family="'Comic Sans MS', cursive" font-size="26" font-weight="900" fill="#ffffff">embers</text><circle cx="105" cy="12" r="3.5" fill="#ffffff"><animate attributeName="opacity" values="1;0.6;1" dur="1.5s" repeatCount="indefinite" /></circle></svg>`;
            logoImg.parentNode.replaceChild(wrapper, logoImg);
        }

        // 3. DONKEYBOT LOGO (Right)
        const targetContainer = document.evaluate("/html/body/div[1]/div[2]/div[3]/div/div", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (targetContainer && !document.getElementById('db-pill-container')) {
            const wrapper = document.createElement('div');
            wrapper.id = 'db-pill-container';
            wrapper.className = 'db-logo-pill';
            wrapper.innerHTML = `<svg width="100" height="25" viewBox="0 0 140 40" xmlns="http://www.w3.org/2000/svg"><text x="5" y="30" font-family="'Comic Sans MS', cursive" font-size="28" font-weight="900" fill="#22153d">donkey<tspan fill="#ff6b6b">bot</tspan></text></svg>`;
            targetContainer.innerHTML = '';
            targetContainer.appendChild(wrapper);
        }

        // 4. CENTER DIV (Timer and Scrape Button)
        const navbarCenter = document.evaluate("/html/body/div[1]/div[2]/div[2]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (navbarCenter) {
            navbarCenter.style.display = 'flex';
            navbarCenter.style.alignItems = 'center';
            navbarCenter.style.width = '100%';

            if (!document.getElementById('copy-prompt-btn')) {
                const btn = document.createElement('button');
                btn.id = 'copy-prompt-btn';
                btn.innerText = "COPY AI PROMPT";
                document.body.appendChild(btn); // Append to body so position:fixed works correctly

                btn.onclick = async () => {
                    const container = document.evaluate("/html/body/div[1]/div[3]/div[2]/div/div/div/div[1]/div/div[3]/div[1]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    if (container) {
                        const prompt = `You are an expert tutor. I am providing you with the raw HTML code for a maths question below. Please parse this HTML, understand the question, and provide a clear step-by-step solution.\n\nHTML Code:\n${container.innerHTML}`;
                        try {
                            await navigator.clipboard.writeText(prompt);
                            btn.classList.add('success-glow');
                            btn.innerText = "COPIED!";
                            setTimeout(() => {
                                btn.classList.remove('success-glow');
                                btn.innerText = "COPY AI PROMPT";
                            }, 2000);
                        } catch (err) { btn.innerText = "ERR"; }
                    }
                };
            }

            if (!document.getElementById('embers-session-timer')) {
                const timerSpan = document.createElement('span');
                timerSpan.id = 'embers-session-timer';
                navbarCenter.appendChild(timerSpan);
            }

            const timerEl = document.getElementById('embers-session-timer');
            if (timerEl) {
                timerEl.innerText = formatTime(seconds);
            }
        }
    };

    injectEmbers();
    setInterval(injectEmbers, 500);
})();