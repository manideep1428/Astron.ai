(function() {
    let selectedText = '';
    let helperDiv = null;
    let isHelperVisible = false;
    let isHelperDisabled = false;
    let showPopupTimeout = null;

    function createHelperDiv() {
        const div = document.createElement('div');
        div.id = 'text-helper-extension';
        div.style.display = 'none';
        div.innerHTML = `
            <button id="define-btn">Define</button>
            <button id="summarize-btn">Summarize</button>
            <button id="translate-btn">Translate</button>
            <button id="text-helper-close">&times;</button>
            <div id="text-helper-result"></div>
            <div id="text-close" style="display: none;">
                <button id="disable-for-site">Close Until Refresh</button>
                <button id="just-close">Close</button>
            </div>
        `;
        document.body.appendChild(div);
        return div;
    }

    function showHelper(rect) {
        if (!helperDiv) {
            helperDiv = createHelperDiv();
        }
        const helperRect = helperDiv.getBoundingClientRect();
        const left = Math.min(rect.left, window.innerWidth - helperRect.width);
        const top = rect.top + window.scrollY - helperRect.height - 10; // Position near selected text, above if possible
        helperDiv.style.left = `${left}px`;
        helperDiv.style.top = `${top}px`;
        helperDiv.style.display = 'block';
        isHelperVisible = true;

        // Reset the "text-close" div display each time helper is shown
        document.getElementById('text-close').style.display = 'none';
    }

    function hideHelper() {
        if (helperDiv) {
            helperDiv.style.display = 'none';
            isHelperVisible = false;

            // Ensure close options are hidden when helper is hidden
            document.getElementById('text-close').style.display = 'none';
        }
    }

    function handleAction(action) {
        const resultDiv = document.getElementById('text-helper-result');
        resultDiv.textContent = `Processing ${action}...`;

        // Simulating API call with random data
        setTimeout(() => {
            let result = '';
            switch (action) {
                case 'Define':
                    result = `Definition: ${getRandomDefinition()}`;
                    break;
                case 'Summarize':
                    result = `Summary: ${getRandomSummary()}`;
                    break;
                case 'Translate':
                    result = `Translation: ${getRandomTranslation()}`;
                    break;
            }
            resultDiv.innerHTML = `<strong>${action} result for:</strong> "${selectedText.slice(0, 20)}..."<br><br>${result}`;
        }, 1000);
    }

    // Helper functions for random data (replace these with actual API calls)
    function getRandomDefinition() {
        const definitions = [
            "The act or process of explaining the meaning of a word or phrase.",
            "A statement of the exact meaning of a word, especially in a dictionary.",
            "An explanation or description of the nature, scope, or meaning of something."
        ];
        return definitions[Math.floor(Math.random() * definitions.length)];
    }

    function getRandomSummary() {
        const summaries = [
            "A brief statement or account of the main points of something.",
            "A short, concise description of the main ideas or points.",
            "An abstract or condensed presentation of the substance of a body of material."
        ];
        return summaries[Math.floor(Math.random() * summaries.length)];
    }

    function getRandomTranslation() {
        const translations = [
            "Bonjour, comment allez-vous?",
            "Hola, ¿cómo estás?",
            "Ciao, come stai?"
        ];
        return translations[Math.floor(Math.random() * translations.length)];
    }

    function handleTextSelection() {
        if (isHelperDisabled) return;

        const selection = window.getSelection();
        const newSelectedText = selection.toString().trim();

        if (newSelectedText.length > 0 && newSelectedText !== selectedText) {
            selectedText = newSelectedText;
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            // Clear any previous timeout and set a new one for delayed display
            if (showPopupTimeout) clearTimeout(showPopupTimeout);

            showPopupTimeout = setTimeout(() => showHelper(rect), 1000);
        }
    }

    document.addEventListener('mouseup', handleTextSelection);

    document.addEventListener('mousedown', function(e) {
        if (isHelperVisible && helperDiv && !helperDiv.contains(e.target)) {
            hideHelper();
        }
    });

    document.addEventListener('click', function(e) {
        if (e.target.id === 'define-btn') {
            handleAction('Define');
        } else if (e.target.id === 'summarize-btn') {
            handleAction('Summarize');
        } else if (e.target.id === 'translate-btn') {
            handleAction('Translate');
        } else if (e.target.id === 'text-helper-close') {
            document.getElementById('text-close').style.display = 'block';
        } else if (e.target.id === 'disable-for-site') {
            isHelperDisabled = true;
            hideHelper();
            localStorage.setItem('text-helper-disabled', 'true');
            alert('Text Helper has been disabled for this site. Refresh the page to re-enable.');
        } else if (e.target.id === 'just-close') {
            hideHelper();
        }
    });

    // Check if the helper is disabled for this site
    if (localStorage.getItem('text-helper-disabled') === 'true') {
        isHelperDisabled = true;
    }

    // Inject styles
    const style = document.createElement('style');
    style.textContent = `
        #text-helper-extension {
            position: absolute;
            z-index: 2147483647;
            background-color: white;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            padding: 10px;
            font-family: Arial, sans-serif;
            max-width: 300px;
        }
        #text-helper-close {
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            margin: 0;
        }
        #text-helper-extension button {
            margin-right: 5px;
            margin-bottom: 10px;
            padding: 5px 10px;
            font-size: 12px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        #text-helper-extension button:hover {
            background-color: #45a049;
        }
        #text-helper-result {
            margin-top: 10px;
            font-size: 14px;
            line-height: 1.4;
        }
        #disable-for-site {
            display: block;
            width: 100%;
            margin-top: 10px;
            background-color: #f44336;
        }
        #disable-for-site:hover {
            background-color: #d32f2f;
        }
    `;
    document.head.appendChild(style);
})();
