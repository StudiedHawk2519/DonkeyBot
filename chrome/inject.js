// inject.js
(function () {
    const LN_THEME = {
        bg: "linear-gradient(to bottom, #ffffff 0%, #f2f2f2 100%)",
        accent: "#22153d",
        highlight: "#0ab4d2",
        border: "#d1d1d1",
        shadow: "0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)",
        coverBg: "#f1f1f1"
    };

    let isExpanded = false;
    let isDragging = false;
    let startX, startY;

    // Independent memory for both states
    let standardPos = { top: "15px", left: "auto", right: "15px" };
    let expandedPos = { top: "268px", left: "50%", transform: "translateX(-50%)" };

    if (document.getElementById('ln-helper-ui')) return;

    const ui = document.createElement('div');
    ui.id = "ln-helper-ui";
    ui.style = `position:fixed; z-index:2147483647; font-family:'Poppins', sans-serif; background:${LN_THEME.bg}; color:${LN_THEME.accent}; border:1px solid ${LN_THEME.border}; border-radius:12px; padding:8px 12px; box-shadow:${LN_THEME.shadow}; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); overflow:hidden; cursor:pointer; top:${standardPos.top}; right:${standardPos.right}; width:120px;`;

    ui.innerHTML = `
        <div id="ln-header" style="display:flex; justify-content:space-between; align-items:center; min-width:80px;">
            <span id="ln-title" style="font-weight:700; color:${LN_THEME.accent}; font-size:13px;">LanguageNot</span>
            <div id="ln-expand-btn" style="width:12px; height:12px; border:2px solid #000; border-radius:2px; cursor:pointer;"></div>
        </div>
        <div id="ln-active-content" style="display:none; margin-top:8px; width: 100%; height: 100%;">
            <div id="ln-cover-view" style="display:none; width: 100%; height:100%; flex-direction:column; align-items:center; justify-content:center; position:relative; background:${LN_THEME.coverBg}; border-radius:10px;">
                 <div id="cover-ans-text" style="font-size:15px; font-weight:600; color:${LN_THEME.accent}; font-family:'Poppins', sans-serif; text-align:center;">...</div>
                 <div style="font-family:'Comic Sans MS', cursive; font-size:11px; font-weight:700; color:${LN_THEME.highlight}; opacity:0.7; margin-top:4px; pointer-events:none;">languagenot</div>
            </div>
            <div id="ln-standard-view" style="width: 100%;">
                <div style="background:rgba(10, 180, 210, 0.1); padding:8px; border-radius:8px; margin-bottom:8px; border-left:3px solid ${LN_THEME.highlight};">
                    <div id="current-ans-text" style="font-size:15px; font-weight:600; color:${LN_THEME.accent};">...</div>
                </div>
                <details id="ln-details" style="cursor:pointer;">
                    <summary style="font-size:10px; font-weight:bold; text-align:center; background:rgba(0,0,0,0.05); padding:4px; border-radius:6px; list-style:none;">LIST ▾</summary>
                    <div id="ln-full-list" style="margin-top:8px; max-height:140px; overflow-y:auto; font-size:11px; border-top:1px solid rgba(0,0,0,0.05);"></div>
                </details>
            </div>
        </div>
    `;
    document.body.appendChild(ui);

    let offsetX, offsetY;

    ui.onmousedown = (e) => {
        if (e.target.closest('#ln-details')) return;

        isDragging = false;
        startX = e.clientX;
        startY = e.clientY;
        const rect = ui.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        document.onmousemove = (moveEvent) => {
            if (Math.abs(moveEvent.clientX - startX) > 5 || Math.abs(moveEvent.clientY - startY) > 5) isDragging = true;
            if (isDragging) {
                ui.style.transition = 'none';
                ui.style.transform = 'none';
                ui.style.left = (moveEvent.clientX - offsetX) + 'px';
                ui.style.top = (moveEvent.clientY - offsetY) + 'px';
                ui.style.right = 'auto';
            }
        };

        document.onmouseup = () => {
            document.onmousemove = null;
            document.onmouseup = null;
            ui.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

            if (isDragging) {
                if (isExpanded) {
                    expandedPos.left = ui.style.left;
                    expandedPos.top = ui.style.top;
                    expandedPos.transform = "none";
                } else {
                    standardPos.left = ui.style.left;
                    standardPos.top = ui.style.top;
                    standardPos.right = "auto";
                }
            } else if (isExpanded) {
                toggleExpand();
            }
        };
    };

    function toggleExpand() {
        if (!isExpanded) {
            isExpanded = true;
            ui.style.left = expandedPos.left;
            ui.style.top = expandedPos.top;
            ui.style.transform = expandedPos.transform;
        } else {
            isExpanded = false;
            ui.style.transform = "none";
            ui.style.left = standardPos.left;
            ui.style.top = standardPos.top;
            ui.style.right = standardPos.right;
        }
        scan();
    }

    document.getElementById('ln-expand-btn').onclick = (e) => {
        e.stopPropagation();
        toggleExpand();
    };

    function getBestText(obj) {
        if (!obj) return null;
        const keys = ['translation', 'word', 'text', 'target', 'answer', 'display'];
        for (let k of keys) if (obj[k] && typeof obj[k] === 'string') return obj[k];
        return Object.values(obj).find(v => typeof v === 'string' && v.length > 1 && !v.includes('http')) || null;
    }

    function scan() {
        const activeArea = document.getElementById('ln-active-content');
        const header = document.getElementById('ln-header');
        const currentAnsDisplay = document.getElementById('current-ans-text');
        const coverAnsDisplay = document.getElementById('cover-ans-text');
        const listDisplay = document.getElementById('ln-full-list');
        const standardView = document.getElementById('ln-standard-view');
        const coverView = document.getElementById('ln-cover-view');
        const controller = window.languagenutControllerObject;

        if (isExpanded) {
            ui.style.width = "400px";
            ui.style.height = "60px";
            ui.style.padding = "0px";
            ui.style.background = "transparent";
            ui.style.border = "none";
            ui.style.boxShadow = "none";
            header.style.display = "none";
            activeArea.style.display = "flex";
            activeArea.style.marginTop = "0px";
            standardView.style.display = "none";
            coverView.style.display = "flex";
        } else {
            ui.style.padding = "8px 12px";
            ui.style.background = LN_THEME.bg;
            ui.style.height = "auto";
            ui.style.border = `1px solid ${LN_THEME.border}`;
            ui.style.boxShadow = LN_THEME.shadow;
            header.style.display = "flex";
            standardView.style.display = "block";
            coverView.style.display = "none";
            activeArea.style.marginTop = "8px";
            if (controller && controller.questions) {
                ui.style.width = "220px";
                activeArea.style.display = "block";
            } else {
                ui.style.width = "120px";
                activeArea.style.display = "none";
            }
        }

        if (controller && controller.questions) {
            const vocab = (controller.currentQuestion ? (controller.currentQuestion.correctVocab || controller.currentQuestion) : null);
            const val = getBestText(vocab);
            if (val) {
                currentAnsDisplay.innerText = val;
                coverAnsDisplay.innerText = val;
            }
            listDisplay.innerHTML = controller.questions.map((item, i) => {
                const aText = getBestText(item.correctVocab || item) || "???";
                const isCurrent = (i === controller.currentQuestionIndex);
                return `<div style="padding:3px 0; color:${isCurrent ? LN_THEME.highlight : LN_THEME.accent}; font-weight:${isCurrent ? '700' : '400'}; border-bottom:1px solid rgba(0,0,0,0.02);">
                    <span style="opacity:0.4">${i + 1}.</span> ${aText}
                </div>`;
            }).join('');
        }
    }

    setInterval(scan, 600);
})();