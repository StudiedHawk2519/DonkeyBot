(function () {
    let seconds = 0;
    // Load saved position or default to bottom-right
    let calcPos = JSON.parse(localStorage.getItem('embers_calc_pos')) || { bottom: '20px', right: '20px', left: 'auto', top: 'auto' };

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

    // 1. STYLESHEET
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

            /* TACTILE BUTTON BASE */
            .tactile-btn {
                background: var(--embers-blue) !important;
                color: white !important;
                border: none !important;
                border-bottom: 4px solid var(--embers-blue-dark) !important;
                text-transform: uppercase;
                font-family: var(--db-ugly) !important;
                font-weight: 900 !important;
                border-radius: 12px !important;
                cursor: pointer !important;
                transition: all 0.1s ease;
                display: inline-flex !important;
                align-items: center;
                justify-content: center;
                height: 32px !important;
                box-sizing: border-box !important;
                position: fixed !important;
                top: 9px !important;
                z-index: 99999 !important;
            }

            /* State: Pressed/Active */
            .tactile-btn.is-active, .tactile-btn:active {
                border-bottom-width: 1px !important;
                transform: translateY(3px) !important;
                background: #28a745 !important;
                border-bottom-color: #1e7e34 !important;
            }

            #copy-prompt-btn { 
                left: calc(50% - 10px) !important; 
                padding: 0 16px !important; 
                font-size: 11px !important; 
                transform: translateX(-100%) !important;
            }
            
            #toggle-calc-btn { 
                left: calc(50% + 10px) !important; 
                width: 36px !important; 
                transform: none !important;
            }

            #copy-prompt-btn.success-glow {
                background: #28a745 !important;
                border-bottom-color: #1e7e34 !important;
            }

            /* DRAGGABLE DESMOS */
            #desmos-container {
                position: fixed;
                width: 450px;
                height: 400px;
                background: white;
                border-radius: 16px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                z-index: 100000;
                display: none;
                flex-direction: column;
                overflow: hidden;
                border: 2px solid var(--panel-dark);
                bottom: ${calcPos.bottom};
                right: ${calcPos.right};
                left: ${calcPos.left};
                top: ${calcPos.top};
            }

            #desmos-header {
                height: 30px;
                background: var(--panel-dark);
                cursor: move;
                display: flex;
                align-items: center;
                padding: 0 10px;
                color: white;
                font-family: var(--sparx-font);
                font-size: 12px;
                font-weight: bold;
            }

            #desmos-container iframe { border: none; width: 100%; height: calc(100% - 30px); }

            #embers-session-timer {
                color: white !important;
                font-family: var(--sparx-font) !important;
                font-size: 15px !important;
                font-weight: 700 !important;
                margin-left: auto !important; 
                padding-right: 10px;
            }

            .db-logo-pill { background: white; padding: 4px 12px; border-radius: 12px; display: flex; align-items: center; }
        `;
        document.head.appendChild(style);
    }

    const makeDraggable = (el, handle) => {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        handle.onmousedown = (e) => {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = () => {
                document.onmouseup = null;
                document.onmousemove = null;
                const savedPos = { top: el.style.top, left: el.style.left, bottom: 'auto', right: 'auto' };
                localStorage.setItem('embers_calc_pos', JSON.stringify(savedPos));
            };
            document.onmousemove = (e) => {
                e.preventDefault();
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                el.style.top = (el.offsetTop - pos2) + "px";
                el.style.left = (el.offsetLeft - pos1) + "px";
                el.style.bottom = 'auto';
                el.style.right = 'auto';
            };
        };
    };

    const injectEmbers = () => {
        // Restore Logos
        const logoImg = document.evaluate("/html/body/div[1]/div[2]/div[1]/a/img", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (logoImg && !document.getElementById('embers-logo-svg')) {
            const wrapper = document.createElement('div');
            wrapper.id = 'embers-logo-svg';
            wrapper.style.display = "flex";
            wrapper.innerHTML = `<svg width="140" height="40" viewBox="0 0 140 40" xmlns="http://www.w3.org/2000/svg"><text x="5" y="28" font-family="'Comic Sans MS', cursive" font-size="26" font-weight="900" fill="#ffffff">embers</text><circle cx="105" cy="12" r="3.5" fill="#ffffff"><animate attributeName="opacity" values="1;0.6;1" dur="1.5s" repeatCount="indefinite" /></circle></svg>`;
            logoImg.parentNode.replaceChild(wrapper, logoImg);
        }

        const targetContainer = document.evaluate("/html/body/div[1]/div[2]/div[3]/div/div", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (targetContainer && !document.getElementById('db-pill-container')) {
            const wrapper = document.createElement('div');
            wrapper.id = 'db-pill-container';
            wrapper.className = 'db-logo-pill';
            wrapper.innerHTML = `<svg width="100" height="25" viewBox="0 0 140 40" xmlns="http://www.w3.org/2000/svg"><text x="5" y="30" font-family="'Comic Sans MS', cursive" font-size="28" font-weight="900" fill="#22153d">donkey<tspan fill="#ff6b6b">bot</tspan></text></svg>`;
            targetContainer.innerHTML = '';
            targetContainer.appendChild(wrapper);
        }

        const navbarCenter = document.evaluate("/html/body/div[1]/div[2]/div[2]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (navbarCenter) {
            navbarCenter.style.display = 'flex';
            navbarCenter.style.alignItems = 'center';
            navbarCenter.style.width = '100%';

            // AI BUTTON
            if (!document.getElementById('copy-prompt-btn')) {
                const btn = document.createElement('button');
                btn.id = 'copy-prompt-btn';
                btn.className = 'tactile-btn';
                btn.innerText = "COPY AI PROMPT";
                document.body.appendChild(btn);
                btn.onclick = async () => {
                    const container = document.evaluate("/html/body/div[1]/div[3]/div[2]/div/div/div/div[1]/div/div[3]/div[1]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    if (container) {
                        const prompt = `You are an expert tutor. I am providing you with the raw HTML code for a maths question below. Please parse this HTML, understand the question, and provide a clear step-by-step solution.\n\nHTML Code:\n${container.innerHTML}`;
                        try {
                            await navigator.clipboard.writeText(prompt);
                            btn.classList.add('success-glow');
                            btn.innerText = "COPIED!";
                            setTimeout(() => { btn.classList.remove('success-glow'); btn.innerText = "COPY AI PROMPT"; }, 2000);
                        } catch (err) { btn.innerText = "ERR"; }
                    }
                };
            }

            // LATCHING CALCULATOR BUTTON
            if (!document.getElementById('toggle-calc-btn')) {
                const calcBtn = document.createElement('button');
                calcBtn.id = 'toggle-calc-btn';
                calcBtn.className = 'tactile-btn';
                calcBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calculator" viewBox="0 0 16 16"><path d="M12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/><path d="M4 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z"/></svg>`;
                document.body.appendChild(calcBtn);

                const calcDiv = document.createElement('div');
                calcDiv.id = 'desmos-container';
                calcDiv.innerHTML = `<div id="desmos-header">Calculator (Drag Me)</div><iframe src="https://www.desmos.com/scientific"></iframe>`;
                document.body.appendChild(calcDiv);

                makeDraggable(calcDiv, calcDiv.querySelector('#desmos-header'));

                calcBtn.onclick = () => {
                    calcBtn.classList.toggle('is-active');
                    const isActive = calcBtn.classList.contains('is-active');
                    calcDiv.style.display = isActive ? 'flex' : 'none';
                };
            }

            if (!document.getElementById('embers-session-timer')) {
                const timerSpan = document.createElement('span');
                timerSpan.id = 'embers-session-timer';
                navbarCenter.appendChild(timerSpan);
            }
            document.getElementById('embers-session-timer').innerText = formatTime(seconds);
        }
    };

    injectEmbers();
    setInterval(injectEmbers, 500);
})();