(function () {
    let seconds = 0;

    // Function to format time as MM:SS or HH:MM:SS
    const formatTime = (s) => {
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = s % 60;
        return [h > 0 ? h : null, m, sec]
            .filter(x => x !== null)
            .map(v => v.toString().padStart(2, '0'))
            .join(':');
    };

    // Increment timer every second
    setInterval(() => { seconds++; }, 1000);

    // 1. STYLESHEET
    if (!document.getElementById('embers-style-fix')) {
        const style = document.createElement('style');
        style.id = 'embers-style-fix';
        style.innerHTML = `
            * { -webkit-user-select: text !important; user-select: text !important; }
            
            button[class*="_NotificationsIconContainer_"], 
            button[class*="_MenuButton_"],
            div[class*="_NavBar_"] + div div > button:nth-child(2),
            div[class*="_NavBar_"] + div div > button:nth-child(3) { 
                visibility: hidden !important; 
                width: 0 !important; 
                padding: 0 !important;
                margin: 0 !important;
                position: absolute !important;
                pointer-events: none !important;
            }

            span[class*="_StudentName_"] {
                white-space: nowrap !important;
                display: inline-block !important;
            }

            div[class*="_Header_"], div[class*="_NavBar_"] {
                display: flex !important;
                flex-direction: row !important;
                align-items: center !important;
                justify-content: space-between !important;
                flex-wrap: nowrap !important;
            }
        `;
        document.head.appendChild(style);
    }

    const injectEmbers = () => {
        // 2. LOGO REPLACEMENT
        const logoImg = document.evaluate("/html/body/div[1]/div[2]/div[1]/a/img", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (logoImg && !document.getElementById('embers-logo-svg')) {
            const wrapper = document.createElement('div');
            wrapper.id = 'embers-logo-svg';
            wrapper.innerHTML = `<svg width="140" height="40" viewBox="0 0 140 40" xmlns="http://www.w3.org/2000/svg"><filter id="brightGlow"><feGaussianBlur stdDeviation="1.2" result="blur"/><feComposite in="SourceGraphic" in2="blur" operator="over"/></filter><text x="5" y="28" font-family="'Comic Sans MS', cursive" font-size="26" font-weight="900" fill="#ffffff">embers</text><circle cx="105" cy="12" r="3.5" fill="#ffffff" filter="url(#brightGlow)"><animate attributeName="opacity" values="1;0.6;1" dur="1.5s" repeatCount="indefinite" /></circle><circle cx="115" cy="22" r="2.5" fill="#ffffff" filter="url(#brightGlow)"><animate attributeName="opacity" values="0.5;1;0.5" dur="1.2s" repeatCount="indefinite" /></circle></svg>`;
            logoImg.parentNode.replaceChild(wrapper, logoImg);
        }

        // 3. RIGHT SIDE HEADER (Timer + Student Name)
        const headerRight = document.evaluate("/html/body/div[1]/div[2]/div[3]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (headerRight && !document.getElementById('session-timer')) {
            const timerSpan = document.createElement('span');
            timerSpan.id = 'session-timer';
            timerSpan.style = `
                background: rgba(255, 255, 255, 0.15);
                color: white;
                padding: 4px 10px;
                border-radius: 12px;
                font-family: "Open Sans", sans-serif;
                font-size: 12px;
                font-weight: 700;
                margin-right: 15px;
                border: 1px solid rgba(255, 255, 255, 0.2);
            `;
            // Insert timer before the student name
            headerRight.insertBefore(timerSpan, headerRight.firstChild);
        }

        // Update the timer text if it exists
        const timerEl = document.getElementById('session-timer');
        if (timerEl) {
            timerEl.innerText = formatTime(seconds);
        }

        // 4. CENTER BUTTON
        const navbarCenter = document.evaluate("/html/body/div[1]/div[2]/div[2]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (navbarCenter && !document.getElementById('copy-prompt-btn')) {
            const btn = document.createElement('button');
            btn.id = 'copy-prompt-btn';
            btn.style = `margin: 0 auto !important; padding: 6px 16px; background: #0066cc; color: white; border: 1px solid rgba(255,255,255,0.4); border-radius: 20px; cursor: pointer; font-size: 11px; font-weight: 900; white-space: nowrap; flex-shrink: 0; transition: background 0.2s ease, transform 0.1s ease; box-shadow: 0 2px 5px rgba(0,0,0,0.15);`;
            btn.innerText = "COPY AI PROMPT";
            navbarCenter.appendChild(btn);

            btn.onclick = async () => {
                const container = document.evaluate("/html/body/div[1]/div[3]/div[2]/div/div/div/div[1]/div/div[3]/div[1]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                if (container && container.innerHTML.trim().length > 0) {
                    const prompt = `You are an expert tutor. I am providing you with the raw HTML code for a maths question below. Please parse this HTML, understand the question, and provide a clear step-by-step solution.\n\nHTML Code:\n${container.innerHTML}`;
                    try {
                        await navigator.clipboard.writeText(prompt);
                        const oldText = btn.innerText;
                        btn.innerText = "COPIED!";
                        btn.style.background = "#28a745";
                        setTimeout(() => { btn.innerText = oldText; btn.style.background = "#0066cc"; }, 2000);
                    } catch (err) { btn.innerText = "ERR"; }
                }
            };
        }
    };

    injectEmbers();
    setInterval(injectEmbers, 500);
})();