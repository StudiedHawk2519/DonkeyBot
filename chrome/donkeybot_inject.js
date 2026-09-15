(function () {
    let seconds = 0;
    let originalDisplayName = null;
    const calcPos = JSON.parse(localStorage.getItem('donkeybot_calc_pos')) || { bottom: '20px', right: '20px', left: 'auto', top: 'auto' };

    const formatTime = (s) => {
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = s % 60;
        return [h > 0 ? h : null, m, sec]
            .filter(x => x !== null)
            .map(v => v.toString().padStart(2, '0'))
            .join(':');
    };

    const applySparxDarkHeader = () => {
        const header = document.querySelector('[class*="_TopBanner_"]');
        if (!header) return;

        header.style.background = 'linear-gradient(to right, #3b5068 0%, #152336 100%)';
        header.style.webkitTextFillColor = 'initial';
        header.style.color = 'var(--colours-text-body-inverted)';
        header.style.height = 'var(--top-banner-height)';
        header.style.flexDirection = 'row';
        header.style.flex = 'none';
        header.style.justifyContent = 'center';
        header.style.alignItems = 'center';
        header.style.display = 'flex';
    };

    const updateSessionTimer = () => {
        const timer = document.getElementById('donkeybot-session-timer');
        if (timer) {
            timer.textContent = formatTime(seconds);
        }
    };

    const syncSessionTimer = () => {
        const target = document.evaluate(
            '/html/body/div[1]/div[2]/div[3]/div/a',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;
        if (!target) return;

        if (!target.dataset.donkeybotOriginalText) {
            target.dataset.donkeybotOriginalText = target.textContent;
        }

        const timerEnabled = document.documentElement.dataset.donkeybotTimerEnabled !== 'false';
        if (timerEnabled) {
            target.id = 'donkeybot-session-timer';
            target.textContent = formatTime(seconds);
        } else {
            target.removeAttribute('id');
            target.textContent = target.dataset.donkeybotOriginalText;
        }
    };

    if (!document.getElementById('donkeybot-theme')) {
        const fontLink = document.createElement('link');
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';
        fontLink.rel = 'stylesheet';
        document.head.appendChild(fontLink);

        const style = document.createElement('style');
        style.id = 'donkeybot-theme';
        style.innerHTML = `
            :root {
                --db-bg: #f4f1ee;
                --db-surface: rgba(255, 255, 255, 0.8);
                --db-surface-strong: #ffffff;
                --db-border: rgba(73, 56, 50, 0.08);
                --db-text: #2c1f1c;
                --db-text-muted: #7c625d;
                --db-accent: #d96b5c;
                --db-accent-soft: rgba(217, 107, 92, 0.12);

                --colours-plain-background: #f7f3f1;
                --colours-transparent-darken: rgba(33, 20, 18, 0.12);
                --colours-text-heading: #2a1c1c;
                --colours-text-body: #382623;
                --colours-text-body-inverted: #ffffff;
                --colours-text-secondary: #6b4b46;
                --colours-text-subtle: #a07a76;
                --colours-text-warning: #b76a35;
                --colours-text-link: #b75043;
                --colours-primary: #d96b5c;
                --colours-primary-hover: #c85d4e;
                --colours-text-on-primary: #ffffff;
                --colours-secondary: #5c2927;
                --colours-secondary-hover: #7f3d37;
                --colours-text-on-secondary: #ffffff;
                --colours-interactable: #d96b5c;
                --colours-selected: #4d3030;
                --colours-loading: #a98a84;
                --colours-disabled-text: #b8a6a1;
                --colours-disabled: #f0e7e4;
                --colours-read-text: #8b7270;
                --colours-plain-background-inverted: #fff7f4;
                --colours-light-background: #fffaf8;
                --colours-light-background-inverted: #4a2b2b;
                --colours-regular-background: #f2e9e5;
                --colours-dark-background: #e4d5d1;
                --colours-page-background: #f5f2ef;
                --colours-page-background-gradient: #f0e6e2;
                --colours-disruptive-dialog-overlay: rgba(34, 19, 18, 0.36);
                --colours-popover-overlay-background: rgba(255, 250, 248, 0.9);
                --colours-background-locked: rgba(122, 92, 85, 0.12);
                --colours-background-white-transparent: rgba(255,255,255,0.8);
                --colours-background-info: rgba(217, 107, 92, 0.08);
                --colours-background-seek-help: rgba(160, 83, 92, 0.08);
                --colours-background-highlighted: #f3e6e1;
                --colours-unstarted: #4d3030;
                --colours-in-progress: #ce7b56;
                --colours-complete: #59ae8d;
                --colours-complete-text: #2e7d5e;
                --colours-not-yet-achieved: #beaca7;
                --colours-optional: #bf9a96;
                --colours-complete-text-dark: #225d46;
                --colours-correct: #48a77c;
                --colours-correct-disabled: rgba(72, 167, 124, 0.13);
                --colours-incorrect: #d95959;
                --colours-seek-help: #9e5f7a;
                --colours-achievement: #d39d69;
                --colours-locked-dark: #927b77;
                --colours-locked: #d9caca;
                --colours-q-swap: #d6a33d;
                --colours-hint: #d6a33d;
                --colours-separator: #ebddd8;
                --colours-border: #ddc9c5;
                --colours-popover-border: #eadfdb;
                --colours-opted-in: #59ae8d;
                --colours-opted-out: #d95959;
                --colours-primary-gradient-start: #e38a7b;
                --colours-primary-gradient-stop: #c85d4e;
                --colours-primary-gradient-stop-light: #f1ab9d;
                --colours-correct-gradient-start: #78d3a6;
                --colours-correct-gradient-stop: #39986d;
                --colours-in-progress-gradient-start: #f1b083;
                --colours-in-progress-gradient-stop: #d77c52;
                --colours-progress-gradient-start: #f7d5c7;
                --colours-progress-gradient-stop: #d96b5c;
                --colours-item: #fffdfc;
                --colours-item-hover: #f8efee;
                --colours-nested-item: #f8f2f0;
                --colours-nested-item-hover: #f0e5e2;
                --colours-nested-item-correct: rgba(72, 167, 124, 0.12);
                --colours-nav-bar: #fffaf8;
                --colours-nav-bar-hover: #f8efee;
                --colours-question-background: #fffdfc;
                --colours-nav-bar-link: #432c2a;
                --colours-nav-bar-link-active: #2a1c1c;
                --colours-tooltip-background: #563f3d;
                --colours-level-badge-1-background: rgba(217, 89, 89, 0.1);
                --colours-level-badge-1-text: #c54c4c;
                --colours-level-badge-2-background: rgba(211, 157, 105, 0.12);
                --colours-level-badge-2-text: #b76a35;
                --colours-level-badge-3-background: rgba(72, 167, 124, 0.12);
                --colours-level-badge-3-text: #2e7d5e;
                --colours-level-badge-4-background: rgba(217, 107, 92, 0.08);
                --colours-level-badge-4-text: #b75043;
                --colours-level-badge-5-background: rgba(158, 95, 122, 0.08);
                --colours-level-badge-5-text: #8c5d74;
                --colours-tip-badge-background: #d9b24e;
                --colours-keypad-backspace: #d95959;
                --colours-keypad-shadow: rgba(217, 107, 92, 0.12);
                --colours-new: #48a77c;
                --colours-training-banner: #7d5e72;
                --colours-tab-hover: rgba(217, 107, 92, 0.08);
                --colours-ftq-navbar-question: #2a1c1c;
                --colours-ftq-navbar-answer: rgba(217, 107, 92, 0.08);
                --colors-ftq-navbar-answer-item-bg: rgba(217, 107, 92, 0.08);
                --colours-sentiment-hate: #d95959;
                --colours-sentiment-dislike: #d39d69;
                --colours-sentiment-neutral: #d6a33d;
                --colours-sentiment-like: #48a77c;
                --colours-sentiment-love: #2e7d5e;
                --colours-text-error-message: #b63e4d;
                --colours-background-error-message: rgba(217, 89, 89, 0.08);
                --colours-text-warning-message: #a4582d;
                --colours-background-warning-message: rgba(211, 157, 105, 0.12);
                --colours-background-success-message: rgba(72, 167, 124, 0.12);
                --colours-shadow-25: rgba(55, 36, 30, 0.12);
                --colours-switch-background: #eadbd7;
                --colours-transparent-glow: rgba(255,255,255,0.35);
                --colours-transparent-20: rgba(255,255,255,0.25);
                --colours-transparent-light: rgba(255,255,255,0.6);
                --colours-transparent-darken-20: rgba(33, 20, 18, 0.06);
                --colours-sparx-learning-text-on-background-dark: #ffffff;
                --colours-sparx-learning-background-dark: #4f3a53;
                --colours-sparx-learning-background-dark-hover: #704d66;
                --colours-curriculum-background-dark: #4d2d2d;
                --colours-sparx-learning-banner-background: #fffaf8;
                --colours-sparx-learning-banner-dropdown: #fffdfc;
                --colours-sparx-learning-banner-dropdown-hover: #f5ece9;
                --colours-sparx-learning-banner-text: #2a1c1c;
                --colours-sparx-learning-banner-light-text: #5e433d;
                --colours-sparx-learning-banner-border: #ebddd8;
                --colours-curriculum-gradient: linear-gradient(91deg, #d96b5c 0.41%, #b14d4d 99.11%);
                --colours-curriculum-gradient-hover: linear-gradient(91deg, #c85d4e 0.41%, #9f3f3f 99.11%);
                --colours-text-on-curriculum-gradient: #ffffff;
            }

            body {
                background: var(--colours-page-background) !important;
                color: var(--colours-text-body) !important;
            }

            * { -webkit-user-select: text !important; user-select: text !important; }

            button[class*="_NotificationsIconContainer_"],
            button[class*="_MenuButton_"],
            div[class*="_NavBar_"] + div div > button:nth-child(2),
            div[class*="_NavBar_"] + div div > button:nth-child(3) {
                display: none !important;
            }

            [class*="_TopBanner_"] {
                background: linear-gradient(90deg, #d96b5c 0%, #c85d4e 100%) !important;
                -webkit-text-fill-color: initial !important;
                color: var(--colours-text-body-inverted) !important;
                height: var(--top-banner-height) !important;
                flex-direction: row !important;
                flex: none !important;
                justify-content: center !important;
                align-items: center !important;
                display: flex !important;
                box-shadow: 0 10px 30px rgba(132, 67, 59, 0.12) !important;
            }

            #donkeybot-header-pill {
                position: fixed;
                top: 0;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                align-items: stretch;
                justify-content: center;
                height: var(--top-banner-height, 68px);
                z-index: 200000;
                font-family: 'Inter', sans-serif;
                pointer-events: auto;
                background: transparent;
                border: none;
                border-radius: 0;
                box-shadow: none;
            }

            .db-toolstack {
                display: inline-flex;
                align-items: center;
                height: 100%;
                gap: 6px;
                flex-direction: row;
            }

            .db-search-shell {
                position: relative;
                display: inline-flex;
                align-items: center;
                width: 220px;
                height: 34px;
                margin: 0 6px;
                border: 1px solid rgba(255,255,255,0.18);
                border-radius: 10px;
                background: rgba(255,255,255,0.08);
                box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
                overflow: visible;
            }

            .db-search-box {
                width: 100%;
                height: 100%;
                border: none;
                border-radius: inherit;
                background: transparent;
                color: rgba(255,255,255,0.96);
                padding: 0 54px 0 12px;
                box-sizing: border-box;
                font-size: 12px;
                font-weight: 600;
                letter-spacing: 0.01em;
                outline: none;
            }

            .db-search-readout {
                display: none;
                width: 100%;
                height: 100%;
                position: relative;
                background: rgba(255,255,255,0.08);
                border: 1px solid rgba(255,255,255,0.12);
                border-radius: 8px;
                color: rgba(255,255,255,0.98);
                box-sizing: border-box;
                padding: 0 26px 0 10px;
                font-size: 11px;
                font-weight: 800;
                line-height: 1.2;
                overflow: hidden;
                align-items: center;
                justify-content: flex-start;
            }

            .db-search-readout.visible {
                display: flex;
            }

            .db-search-readout .db-ai-answer-text {
                display: inline-flex;
                align-items: center;
                max-width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                cursor: pointer;
            }

            .db-ai-reasoning {
                position: absolute;
                right: 0;
                top: calc(100% + 8px);
                width: 260px;
                max-height: 220px;
                display: none;
                overflow: auto;
                padding: 10px 28px 10px 11px;
                background: rgba(47, 32, 30, 0.96);
                border: 1px solid rgba(255,255,255,0.16);
                border-radius: 8px;
                color: rgba(255,255,255,0.96);
                box-shadow: 0 12px 20px rgba(17, 10, 10, 0.2);
                font-size: 11px;
                line-height: 1.45;
                white-space: pre-wrap;
                z-index: 5;
            }

            .db-ai-reasoning.visible {
                display: block;
            }

            .db-ai-reasoning-close {
                position: absolute;
                top: 5px;
                right: 7px;
                border: none;
                background: transparent;
                color: rgba(255,255,255,0.72);
                cursor: pointer;
                font-size: 13px;
                line-height: 1;
                padding: 0;
            }

            .db-search-readout .db-ai-answer-text .katex {
                font-size: 1em;
            }

            .db-ai-clear {
                position: absolute;
                right: 8px;
                top: 50%;
                transform: translateY(-50%);
                width: 14px;
                height: 14px;
                border: none;
                background: transparent;
                color: rgba(32, 25, 24, 0.7);
                cursor: pointer;
                font-size: 12px;
                line-height: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
            }

            .db-search-loading {
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
                width: 12px;
                height: 12px;
                border-radius: 50%;
                border: 2px solid rgba(255,255,255,0.28);
                border-top-color: rgba(255,255,255,0.95);
                display: none;
                animation: db-spin 0.9s linear infinite;
            }

            .db-search-loading.visible {
                display: block;
            }

            @keyframes db-spin {
                to {
                    transform: translateY(-50%) rotate(360deg);
                }
            }

            .db-search-box::placeholder {
                color: rgba(255,255,255,0.7);
            }

            .db-search-box:focus {
                border-color: rgba(255,255,255,0.28);
                background: rgba(255,255,255,0.12);
            }

            .db-search-answer {
                display: none;
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
                align-items: center;
                justify-content: center;
                width: 28px;
                height: 24px;
                padding: 0;
                border-radius: 6px;
                background: rgba(255,255,255,0.12);
                border: 1px solid rgba(255,255,255,0.18);
                color: rgba(255,255,255,0.98);
                pointer-events: auto;
                cursor: pointer;
            }

            .db-search-answer svg {
                width: 14px;
                height: 14px;
                stroke: currentColor;
                fill: none;
                stroke-width: 2.4;
                stroke-linecap: round;
                stroke-linejoin: round;
            }

            .db-result-box {
                position: absolute;
                right: 8px;
                top: 50%;
                transform: translateY(-50%);
                min-width: 86px;
                max-width: 170px;
                min-height: 26px;
                display: none;
                align-items: center;
                justify-content: center;
                background: #ffffff;
                border: 1px solid rgba(82, 67, 65, 0.12);
                border-radius: 8px;
                color: #201918;
                box-shadow: 0 10px 20px rgba(17, 10, 10, 0.12);
                padding: 6px 22px 6px 10px;
                z-index: 2;
                box-sizing: border-box;
            }

            .db-result-box.visible {
                display: flex;
            }

            .db-result-content {
                font-size: 11px;
                font-weight: 800;
                line-height: 1.2;
                max-width: 150px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: #1d1514;
            }

            .db-result-content .katex {
                font-size: 1em;
            }

            .db-result-close {
                position: absolute;
                top: 4px;
                right: 5px;
                width: 14px;
                height: 14px;
                border: none;
                background: transparent;
                color: rgba(32, 25, 24, 0.7);
                font-size: 12px;
                line-height: 1;
                cursor: pointer;
                padding: 0;
            }

            .db-result-full {
                position: absolute;
                right: 0;
                top: calc(100% + 8px);
                width: 220px;
                display: none;
                background: rgba(255,255,255,0.08);
                border: 1px solid rgba(255,255,255,0.12);
                border-radius: 8px;
                color: rgba(255,255,255,0.98);
                box-shadow: 0 12px 20px rgba(17, 10, 10, 0.12);
                padding: 8px 10px;
                font-size: 11px;
                line-height: 1.45;
                white-space: normal;
                z-index: 3;
            }

            .db-result-full.visible {
                display: block;
            }

            .db-pill-btn {
                background: rgba(255,255,255,0.08) !important;
                color: rgba(255,255,255,0.96) !important;
                border: 1px solid rgba(255,255,255,0.12) !important;
                border-radius: 10px !important;
                cursor: pointer !important;
                transition: background 0.15s ease, color 0.15s ease !important;
                display: inline-flex !important;
                align-items: center;
                justify-content: center;
                width: 40px !important;
                height: 38px !important;
                box-sizing: border-box !important;
                padding: 0 !important;
                box-shadow: inset 0 1px 0 rgba(255,255,255,0.05) !important;
            }

            .db-pill-btn svg {
                width: 18px !important;
                height: 18px !important;
                stroke-width: 2.2 !important;
            }

            .db-pill-btn:hover {
                background: rgba(255,255,255,0.18) !important;
                color: #fff !important;
            }

            .db-pill-btn.is-active, .db-pill-btn:active {
                background: rgba(255,255,255,0.22) !important;
            }

            #copy-prompt-btn.success-glow {
                background: rgba(34, 197, 94, 0.18) !important;
            }

            ._BackButton_1iso5_1 {
                background: rgb(138 61 61 / 35%) !important;
            }

            #donkeybot-session-timer {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                height: 100%;
                min-width: 68px;
                padding: 0 14px;
                box-sizing: border-box;
                background: rgba(255,255,255,0.08);
                border: none;
                border-left: 1px solid rgba(255,255,255,0.12);
                color: rgba(255,255,255,0.98) !important;
                font-size: 12px !important;
                font-weight: 700 !important;
                letter-spacing: 0.04em;
                text-transform: uppercase;
                margin-left: 0;
                box-shadow: none;
                cursor: default;
            }

            #desmos-container {
                position: fixed;
                width: 450px;
                height: 400px;
                background: linear-gradient(180deg, #fffdfc 0%, #f9f3f1 100%);
                border-radius: 16px;
                box-shadow: 0 14px 42px rgba(57, 35, 31, 0.18);
                z-index: 100000;
                display: none;
                flex-direction: column;
                overflow: hidden;
                border: 1px solid rgba(73, 56, 50, 0.14);
                bottom: ${calcPos.bottom};
                right: ${calcPos.right};
                left: ${calcPos.left};
                top: ${calcPos.top};
            }

            #desmos-header {
                height: 38px;
                background: linear-gradient(90deg, rgba(217, 107, 92, 0.18), rgba(233, 176, 160, 0.1));
                cursor: move;
                display: flex;
                align-items: center;
                padding: 0 14px;
                color: #2c1f1c;
                font-family: 'Inter', sans-serif;
                font-size: 12px;
                font-weight: 700;
                letter-spacing: 0.02em;
                border-bottom: 1px solid rgba(73, 56, 50, 0.08);
            }

            #desmos-container iframe {
                border: none;
                width: 100%;
                height: calc(100% - 38px);
                background: #fff;
            }
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
                localStorage.setItem('donkeybot_calc_pos', JSON.stringify(savedPos));
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

    const ensureMathJs = () => new Promise((resolve) => {
        if (window.math) {
            resolve();
            return;
        }
        const existing = document.querySelector('script[data-donkeybot-mathjs]');
        if (existing) {
            existing.addEventListener('load', resolve, { once: true });
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/mathjs@13.2.0/lib/browser/math.js';
        script.setAttribute('data-donkeybot-mathjs', 'true');
        script.onload = resolve;
        script.onerror = resolve;
        document.head.appendChild(script);
    });

    const ensureKatex = () => new Promise((resolve) => {
        if (window.katex) {
            resolve();
            return;
        }
        const css = document.querySelector('link[data-donkeybot-katex-css]');
        if (!css) {
            const katexCss = document.createElement('link');
            katexCss.rel = 'stylesheet';
            katexCss.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css';
            katexCss.setAttribute('data-donkeybot-katex-css', 'true');
            document.head.appendChild(katexCss);
        }
        const existing = document.querySelector('script[data-donkeybot-katex]');
        if (existing) {
            existing.addEventListener('load', resolve, { once: true });
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js';
        script.setAttribute('data-donkeybot-katex', 'true');
        script.onload = resolve;
        script.onerror = resolve;
        document.head.appendChild(script);
    });

    const getStoredApiKey = async () => new Promise((resolve) => {
        const storage = globalThis.chrome && globalThis.chrome.storage ? globalThis.chrome.storage.local : null;
        if (!storage) {
            resolve('');
            return;
        }

        storage.get({ llm7_api_key: '' }, (data) => {
            resolve((data && data.llm7_api_key ? data.llm7_api_key : '').trim());
        });
    });

    const extractAnswerTag = (text) => {
        const match = [...text.matchAll(/<answer>([\s\S]*?)<\/answer>/gi)].at(-1);
        if (!match) return null;
        return match[1].trim();
    };

    const renderLatex = (el, rawText) => {
        const value = (rawText || '').trim();
        if (!value) {
            el.textContent = '';
            return;
        }
        try {
            const rendered = window.katex.renderToString(value, {
                throwOnError: false,
                displayMode: false,
                output: 'htmlAndMathml'
            });
            el.innerHTML = rendered;
        } catch (err) {
            el.textContent = value;
        }
    };

    const hideResultBox = (shell) => {
        if (!shell) return;
        const resultBox = shell.querySelector('.db-result-box');
        const fullText = shell.querySelector('.db-result-full');
        const reasoning = shell.querySelector('.db-ai-reasoning');
        if (resultBox) resultBox.classList.remove('visible');
        if (fullText) fullText.classList.remove('visible');
        if (fullText) fullText.textContent = '';
        if (reasoning) reasoning.classList.remove('visible');
    };

    const setAiLoadingState = (shell, isLoading) => {
        if (!shell) return;
        const input = shell.querySelector('.db-search-box');
        const readout = shell.querySelector('.db-search-readout');
        const loading = shell.querySelector('.db-search-loading');
        const sendBtn = shell.querySelector('.db-search-answer');

        if (loading) {
            loading.classList.toggle('visible', Boolean(isLoading));
        }

        if (sendBtn) {
            sendBtn.style.display = isLoading ? 'inline-flex' : 'none';
        }

        if (input) {
            input.style.display = isLoading || !readout?.classList.contains('visible') ? 'block' : 'none';
        }

        if (readout && !isLoading && !readout.classList.contains('visible')) {
            readout.classList.remove('visible');
        }
    };

    const showAiAnswerState = (shell, answerText, fullText) => {
        if (!shell) return;
        const input = shell.querySelector('.db-search-box');
        const readout = shell.querySelector('.db-search-readout');
        const answerNode = shell.querySelector('.db-ai-answer-text');
        const closeBtn = shell.querySelector('.db-ai-clear');
        const sendBtn = shell.querySelector('.db-search-answer');
        const loading = shell.querySelector('.db-search-loading');
        const reasoning = shell.querySelector('.db-ai-reasoning');
        const reasoningText = shell.querySelector('.db-ai-reasoning-text');
        const reasoningClose = shell.querySelector('.db-ai-reasoning-close');

        if (!readout || !answerNode || !closeBtn) return;

        if (sendBtn) sendBtn.style.display = 'none';
        if (input) input.style.display = 'none';
        if (loading) loading.classList.remove('visible');

        renderLatex(answerNode, answerText || 'Answer');
        readout.classList.add('visible');
        readout.dataset.answer = String(fullText || answerText || '');
        answerNode.style.display = 'inline-flex';

        if (reasoning && reasoningText) {
            reasoningText.textContent = fullText || answerText || '';
            reasoning.classList.remove('visible');
        }

        answerNode.onclick = () => {
            if (reasoning) {
                reasoning.classList.toggle('visible');
            }
        };

        if (reasoningClose) {
            reasoningClose.onclick = (event) => {
                event.stopPropagation();
                reasoning.classList.remove('visible');
            };
        }

        closeBtn.onclick = () => {
            if (input) {
                input.value = '';
                input.style.display = 'block';
            }
            readout.classList.remove('visible');
            if (sendBtn) sendBtn.style.display = 'none';
            if (loading) loading.classList.remove('visible');
            if (reasoning && reasoningText) {
                reasoning.classList.remove('visible');
                reasoningText.textContent = '';
            }
            hideResultBox(shell);
        };
    };

    const updateDisplayName = () => {
        const target = document.querySelector('[class*="StudentName"]') || document.evaluate(
            '//*[@id="root"]/div[2]/div[3]/div/div',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;
        if (!target) return;

        const nameEnabled = document.documentElement.dataset.donkeybotNameEnabled === 'true';
        const customName = (document.documentElement.dataset.donkeybotName || '').trim();
        if (originalDisplayName === null) originalDisplayName = target.textContent;

        if (nameEnabled && customName) {
            target.textContent = customName;
        } else if (originalDisplayName !== null) {
            target.textContent = originalDisplayName;
        }
    };

    const showResultBox = (shell, answerText, fullText) => {
        if (!shell) return;
        const resultBox = shell.querySelector('.db-result-box');
        const resultContent = shell.querySelector('.db-result-content');
        const fullPanel = shell.querySelector('.db-result-full');
        const closeBtn = shell.querySelector('.db-result-close');
        const sendBtn = shell.querySelector('.db-search-answer');

        if (!resultBox || !resultContent || !fullPanel || !closeBtn) return;

        if (sendBtn) sendBtn.style.display = 'none';
        resultBox.classList.add('visible');
        renderLatex(resultContent, answerText);
        fullPanel.textContent = fullText || answerText || '';
        fullPanel.classList.remove('visible');

        closeBtn.onclick = (event) => {
            event.stopPropagation();
            hideResultBox(shell);
            if (sendBtn) sendBtn.style.display = 'none';
        };

        resultContent.onclick = () => {
            fullPanel.classList.toggle('visible');
        };
    };

    const sendAiPrompt = async (prompt) => {
        const trimmed = (prompt || '').replace(/\s+/g, ' ').trim();
        const compactPrompt = trimmed.length > 1800 ? `${trimmed.slice(0, 1750)}…` : trimmed;
        const apiKey = (await getStoredApiKey()).trim();
        const modelCandidates = ['openai/gpt-4o-mini', 'meta-llama/Meta-Llama-3.1-8B-Instruct', 'default'];
        let lastError = null;

        for (const model of modelCandidates) {
            try {
                const headers = {
                    'Content-Type': 'application/json'
                };
                if (apiKey) {
                    headers.Authorization = `Bearer ${apiKey}`;
                }

                const response = await fetch('https://api.llm7.io/v1/chat/completions', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        model,
                        temperature: 0.2,
                        max_tokens: 180,
                        messages: [
                            {
                                role: 'system',
                                content: 'You are a concise maths tutor. Keep every answer short and useful. Always include the final answer in <answer>...</answer> tags. If the user asks a non-maths question, still answer helpfully but keep the final answer within <answer> tags. Do not send large explanations; be compact to save tokens.'
                            },
                            {
                                role: 'user',
                                content: compactPrompt
                            }
                        ]
                    })
                });

                const data = await response.json().catch(() => ({}));
                if (!response.ok) {
                    const message = data?.error?.message || `HTTP ${response.status}`;
                    lastError = new Error(message);
                    if (response.status !== 400 && response.status !== 404 && response.status !== 422) {
                        throw lastError;
                    }
                    continue;
                }

                const text = data.choices?.[0]?.message?.content || '';
                if (!text) {
                    lastError = new Error('LLM7 returned an empty response.');
                    continue;
                }
                return text;
            } catch (err) {
                lastError = err;
            }
        }

        throw lastError || new Error('LLM7 request failed.');
    };

    const handleAiPrompt = async () => {
        const shell = document.getElementById('donkeybot-search-shell');
        if (!shell) return;
        const input = shell.querySelector('.db-search-box');
        const sendBtn = shell.querySelector('.db-search-answer');
        if (!input || !sendBtn) return;

        const prompt = input.value.trim();
        if (!prompt) return;

        setAiLoadingState(shell, true);
        sendBtn.disabled = true;
        sendBtn.style.opacity = '0.65';
        sendBtn.style.cursor = 'wait';

        try {
            const responseText = await sendAiPrompt(prompt);
            const answerText = extractAnswerTag(responseText) || 'Click to see answer';
            showAiAnswerState(shell, answerText, responseText);
        } catch (err) {
            console.error('DonkeyBot AI request failed:', err);
            showAiAnswerState(shell, 'Error', err.message || 'AI request failed.');
        } finally {
            sendBtn.disabled = false;
            sendBtn.style.opacity = '';
            sendBtn.style.cursor = '';
            setAiLoadingState(shell, false);
        }
    };

    const updateMathAnswer = async () => {
        const shell = document.getElementById('donkeybot-search-shell');
        if (!shell) return;
        const input = shell.querySelector('.db-search-box');
        const sendBtn = shell.querySelector('.db-search-answer');
        const resultBox = shell.querySelector('.db-result-box');
        if (!input || !sendBtn || !resultBox) return;

        const raw = input.value.trim();
        if (!raw) {
            sendBtn.style.display = 'none';
            hideResultBox(shell);
            return;
        }

        try {
            await ensureMathJs();
            const expression = raw.replace(/\s+/g, '');
            const value = window.math.evaluate(expression);
            let output = '';

            if (typeof value === 'number') {
                output = Number.isInteger(value) ? String(value) : String(Number(value.toFixed(10)));
            } else if (typeof value === 'string') {
                output = value;
            } else if (value && typeof value.toString === 'function') {
                output = value.toString();
            }

            if (output) {
                sendBtn.style.display = 'none';
                showResultBox(shell, output, `Math result: ${output}`);
                return;
            }
        } catch (err) {
            // Not valid maths; show send arrow for AI flow.
        }

        sendBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h12"></path>
                <path d="M13 5l7 7-7 7"></path>
            </svg>
        `;
        sendBtn.style.display = 'inline-flex';
        hideResultBox(shell);
    };

    const injectDonkeyBot = () => {
        if (!document.getElementById('donkeybot-header-pill')) {
            const pill = document.createElement('div');
            pill.id = 'donkeybot-header-pill';
            pill.innerHTML = `
                <div class="db-toolstack">
                    <button id="copy-prompt-btn" class="db-pill-btn" type="button" aria-label="Copy AI prompt">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    </button>
                    <button id="toggle-calc-btn" class="db-pill-btn" type="button" title="Open calculator" aria-label="Open calculator">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/><path d="M4 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z"/></svg>
                    </button>
                    <div id="donkeybot-search-shell" class="db-search-shell">
                        <input id="donkeybot-ai-search" class="db-search-box" type="text" placeholder="type anything." aria-label="Ask AI" />
                        <div class="db-search-readout" aria-live="polite">
                            <div class="db-ai-answer-text"></div>
                            <button type="button" class="db-ai-clear" aria-label="Clear answer">×</button>
                        </div>
                        <div class="db-search-loading" aria-label="Loading"></div>
                        <div class="db-ai-reasoning" role="dialog" aria-live="polite">
                            <button type="button" class="db-ai-reasoning-close" aria-label="Close reasoning">×</button>
                            <div class="db-ai-reasoning-text"></div>
                        </div>
                        <button type="button" class="db-search-answer" aria-label="Send prompt to AI">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M5 12h12"></path>
                                <path d="M13 5l7 7-7 7"></path>
                            </svg>
                        </button>
                        <div class="db-result-box" aria-live="polite">
                            <button type="button" class="db-result-close" aria-label="Dismiss answer">×</button>
                            <div class="db-result-content"></div>
                            <div class="db-result-full"></div>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(pill);

            const copyBtn = document.getElementById('copy-prompt-btn');
            const calcBtn = document.getElementById('toggle-calc-btn');
            const aiSearch = document.getElementById('donkeybot-ai-search');
            const aiSend = document.querySelector('.db-search-answer');
            if (aiSearch) {
                aiSearch.addEventListener('input', updateMathAnswer);
                aiSearch.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        const answer = document.querySelector('.db-search-answer');
                        if (answer && answer.style.display !== 'none') {
                            answer.click();
                        }
                    }
                });
            }
            if (aiSend) {
                aiSend.addEventListener('click', handleAiPrompt);
            }

            const calcDiv = document.createElement('div');
            calcDiv.id = 'desmos-container';
            calcDiv.innerHTML = `<div id="desmos-header">Calculator (Drag Me)</div><iframe src="https://www.desmos.com/scientific"></iframe>`;
            document.body.appendChild(calcDiv);
            makeDraggable(calcDiv, calcDiv.querySelector('#desmos-header'));

            copyBtn.onclick = async () => {
                const container = document.evaluate("/html/body/div[1]/div[3]/div[2]/div/div/div/div[1]/div/div[3]/div[1]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                if (!container) return;
                const prompt = `You are an expert tutor. I am providing you with the raw HTML code for a maths question below. Please parse this HTML, understand the question, and provide a clear step-by-step solution.\n\nHTML Code:\n${container.innerHTML}`;
                try {
                    await navigator.clipboard.writeText(prompt);
                    copyBtn.classList.add('success-glow');
                    copyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"></path></svg>`;
                    setTimeout(() => {
                        copyBtn.classList.remove('success-glow');
                        copyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
                    }, 1500);
                } catch (err) {
                    copyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
                }
            };

            calcBtn.onclick = () => {
                calcBtn.classList.toggle('is-active');
                const isActive = calcBtn.classList.contains('is-active');
                calcDiv.style.display = isActive ? 'flex' : 'none';
            };
        }

        const timer = document.getElementById('donkeybot-session-timer');
        if (timer) timer.innerText = formatTime(seconds);
        syncSessionTimer();
        updateDisplayName();
    };

    injectDonkeyBot();
    applySparxDarkHeader();
    updateSessionTimer();

    setInterval(() => {
        seconds += 1;
        updateSessionTimer();
        injectDonkeyBot();
        applySparxDarkHeader();
    }, 1000);
})();