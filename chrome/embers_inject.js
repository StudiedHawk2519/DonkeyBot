(function () {
    // 1. STYLESHEET
    if (!document.getElementById('embers-style-fix')) {
        const style = document.createElement('style');
        style.id = 'embers-style-fix';
        style.innerHTML = `
            * { -webkit-user-select: text !important; user-select: text !important; }
            
            button[class*="_NotificationsIconContainer_"], 
            button[class*="_MenuButton_"] { 
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
            wrapper.innerHTML = `
                <svg width="140" height="40" viewBox="0 0 140 40" xmlns="http://www.w3.org/2000/svg">
                    <filter id="brightGlow"><feGaussianBlur stdDeviation="1.2" result="blur"/><feComposite in="SourceGraphic" in2="blur" operator="over"/></filter>
                    <text x="5" y="28" font-family="'Comic Sans MS', cursive" font-size="26" font-weight="900" fill="#ffffff">embers</text>
                    <circle cx="105" cy="12" r="3.5" fill="#ffffff" filter="url(#brightGlow)"><animate attributeName="opacity" values="1;0.6;1" dur="1.5s" repeatCount="indefinite" /></circle>
                    <circle cx="115" cy="22" r="2.5" fill="#ffffff" filter="url(#brightGlow)"><animate attributeName="opacity" values="0.5;1;0.5" dur="1.2s" repeatCount="indefinite" /></circle>
                </svg>`;
            logoImg.parentNode.replaceChild(wrapper, logoImg);
        }

        // 3. STANDALONE LIGHTER BLUE BUTTON
        const navbar = document.evaluate("/html/body/div[1]/div[2]/div[2]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (navbar && !document.getElementById('copy-prompt-btn')) {
            const btn = document.createElement('button');
            btn.id = 'copy-prompt-btn';

            btn.style = `
                margin: 0 auto !important; 
                padding: 6px 16px; 
                background: #0066cc; /* Lighter Blue */
                color: white; 
                border: 1px solid rgba(255,255,255,0.4); 
                border-radius: 20px; 
                cursor: pointer; 
                font-size: 11px; 
                font-weight: 900; 
                white-space: nowrap;
                flex-shrink: 0;
                transition: background 0.2s ease, transform 0.1s ease;
                box-shadow: 0 2px 5px rgba(0,0,0,0.15);
            `;
            btn.innerText = "COPY AI PROMPT";

            btn.onmouseover = () => { btn.style.background = "#0077ee"; };
            btn.onmouseout = () => { btn.style.background = "#0066cc"; };
            btn.onmousedown = () => { btn.style.transform = "scale(0.96)"; };
            btn.onmouseup = () => { btn.style.transform = "scale(1)"; };

            navbar.appendChild(btn);

            btn.onclick = async (e) => {
                const btnRef = e.target;
                const containerXpath = "/html/body/div[1]/div[3]/div[2]/div/div/div/div[1]/div/div[3]/div[1]";
                const container = document.evaluate(containerXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

                if (container && container.innerHTML.trim().length > 0) {
                    const prompt = `You are an expert tutor. I am providing you with the raw HTML code for a maths question below. Please parse this HTML, understand the question, and provide a clear step-by-step solution.\n\nHTML Code:\n${container.innerHTML}`;

                    try {
                        await navigator.clipboard.writeText(prompt);
                        const oldText = btnRef.innerText;
                        btnRef.innerText = "COPIED!";
                        btnRef.style.background = "#28a745";
                        setTimeout(() => {
                            btnRef.innerText = oldText;
                            btnRef.style.background = "#0066cc";
                        }, 2000);
                    } catch (err) { btnRef.innerText = "ERR"; }
                } else {
                    const oldText = btnRef.innerText;
                    btnRef.innerText = "NOT ON QUESTION";
                    btnRef.style.background = "#dc3545";
                    setTimeout(() => {
                        btnRef.innerText = oldText;
                        btnRef.style.background = "#0066cc";
                    }, 2000);
                }
            };
        }
    };

    injectEmbers();
    setInterval(injectEmbers, 500);
})();