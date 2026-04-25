// inject.js
(function () {
    const LN_THEME = {
        bg: "linear-gradient(to bottom, #ffffff 0%, #f2f2f2 100%)",
        accent: "#22153d",
        highlight: "#0ab4d2",
        border: "#d1d1d1",
        shadow: "0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)"
    };

    let isMinimized = false;
    let isDragging = false;
    let startX, startY;

    if (document.getElementById('ln-helper-ui')) return;

    const ui = document.createElement('div');
    ui.id = "ln-helper-ui";
    ui.style = `position:fixed; z-index:2147483647; font-family:'Poppins', sans-serif; background:${LN_THEME.bg}; color:${LN_THEME.accent}; border:1px solid ${LN_THEME.border}; border-radius:12px; padding:8px 12px; box-shadow:${LN_THEME.shadow}; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); overflow:hidden; cursor:pointer; top:15px; right:15px; width:120px;`;

    ui.innerHTML = `
        <div id="ln-header" style="display:flex; justify-content:space-between; align-items:center; min-width:80px;">
            <span id="ln-title" style="font-weight:700; color:${LN_THEME.accent}; font-size:13px;">LanguageNot</span>
            <div id="ln-toggle-btn" style="display:flex; align-items:center; padding: 2px 5px;">
                <div id="ln-min-line" style="width:12px; height:2px; background:#000; border-radius:2px; transition: transform 0.3s;"></div>
            </div>
        </div>
        <div id="ln-active-content" style="display:none; margin-top:8px;">
            <div style="background:rgba(10, 180, 210, 0.1); padding:8px; border-radius:8px; margin-bottom:8px; border-left:3px solid ${LN_THEME.highlight};">
                <div style="font-size:9px; text-transform:uppercase; opacity:0.6; font-weight:bold; color:${LN_THEME.highlight};">Current Answer</div>
                <div id="current-ans-text" style="font-size:15px; font-weight:600; color:${LN_THEME.accent};">...</div>
            </div>
            <details id="ln-details" style="cursor:pointer;">
                <summary style="font-size:10px; font-weight:bold; text-align:center; background:rgba(0,0,0,0.05); padding:4px; border-radius:6px; list-style:none;">LIST ▾</summary>
                <div id="ln-full-list" style="margin-top:8px; max-height:140px; overflow-y:auto; font-size:11px; border-top:1px solid rgba(0,0,0,0.05);"></div>
            </details>
        </div>
    `;
    document.body.appendChild(ui);

    // --- Drag and Click Logic ---
    let offsetX, offsetY;

    ui.onmousedown = (e) => {
        if (e.target.closest('#ln-details')) return;

        isDragging = false;
        startX = e.clientX;
        startY = e.clientY;

        offsetX = e.clientX - ui.getBoundingClientRect().left;
        offsetY = e.clientY - ui.getBoundingClientRect().top;

        document.onmousemove = (moveEvent) => {
            // If mouse moves more than 5px, it's a drag, not a toggle click
            if (Math.abs(moveEvent.clientX - startX) > 5 || Math.abs(moveEvent.clientY - startY) > 5) {
                isDragging = true;
            }

            if (isDragging) {
                ui.style.left = (moveEvent.clientX - offsetX) + 'px';
                ui.style.top = (moveEvent.clientY - offsetY) + 'px';
                ui.style.right = 'auto';
                ui.style.transition = 'none'; // Disable transition during drag for smoothness
            }
        };

        document.onmouseup = () => {
            document.onmousemove = null;
            document.onmouseup = null;
            ui.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'; // Re-enable animation

            // If we didn't drag, then it's a click to toggle
            if (!isDragging) {
                isMinimized = !isMinimized;
                scan();
            }
        };
    };

    function getBestText(obj) {
        if (!obj) return null;
        const keys = ['translation', 'word', 'text', 'target', 'answer', 'display'];
        for (let k of keys) if (obj[k] && typeof obj[k] === 'string') return obj[k];
        if (obj.audio) return obj.audio.split('/').pop().split('.')[0].replace(/_/g, ' ');
        return Object.values(obj).find(v => typeof v === 'string' && v.length > 1 && !v.includes('http')) || null;
    }

    function scan() {
        const activeArea = document.getElementById('ln-active-content');
        const title = document.getElementById('ln-title');
        const minLine = document.getElementById('ln-min-line');
        const currentAnsDisplay = document.getElementById('current-ans-text');
        const listDisplay = document.getElementById('ln-full-list');
        const controller = window.languagenutControllerObject;

        if (isMinimized) {
            ui.style.width = "40px"; ui.style.height = "30px";
            title.style.display = "none"; activeArea.style.display = "none";
            minLine.style.transform = "translateY(5px)";
            return;
        }

        ui.style.height = "auto"; title.style.display = "block"; minLine.style.transform = "none";

        if (controller && controller.questions) {
            ui.style.width = "220px"; activeArea.style.display = "block";
            const vocab = (controller.currentQuestion ? (controller.currentQuestion.correctVocab || controller.currentQuestion) : null);
            const val = getBestText(vocab);
            if (val) currentAnsDisplay.innerText = val;
            listDisplay.innerHTML = controller.questions.map((item, i) => {
                const aText = getBestText(item.correctVocab || item) || "???";
                const isCurrent = (i === controller.currentQuestionIndex);
                return `<div style="padding:3px 0; color:${isCurrent ? LN_THEME.highlight : LN_THEME.accent}; font-weight:${isCurrent ? '700' : '400'}; border-bottom:1px solid rgba(0,0,0,0.02);">
                    <span style="opacity:0.4">${i + 1}.</span> ${aText}
                </div>`;
            }).join('');
        } else {
            ui.style.width = "120px"; activeArea.style.display = "none";
        }
    }

    setInterval(scan, 600);
})();