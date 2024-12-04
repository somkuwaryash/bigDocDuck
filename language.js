// Language detection functionality
document.addEventListener('DOMContentLoaded', async function() {
    // Track language detector instance
    let detector = null;

    async function initializeDetector() {
        try {
            const canDetect = await translation.canDetect();
            
            if (canDetect !== 'no') {
                detector = await translation.createDetector();
                
                if (canDetect !== 'readily') {
                    detector.addEventListener('downloadprogress', (e) => {
                        console.log('Loading language model:', Math.round((e.loaded / e.total) * 100) + '%');
                    });
                    await detector.ready;
                }
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error initializing language detector:', error);
            return false;
        }
    }

    function createLanguageTag(language, confidence) {
        const tag = document.createElement('div');
        tag.className = 'inline-block text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full ml-2';
        // Show language code and confidence percentage
        tag.textContent = `${language} (${Math.round(confidence * 100)}%)`;
        return tag;
    }

    async function detectAndDisplayLanguage(text, separator) {
        if (!detector && !(await initializeDetector())) {
            console.warn('Language detection not available');
            return;
        }

        try {
            const results = await detector.detect(text);
            if (results && results.length > 0) {
                // Get the most confident result
                const topResult = results[0];
                
                // Find the separator element
                const separators = document.querySelectorAll('.file-separator');
                const lastSeparator = separators[separators.length - 1];
                
                if (lastSeparator) {
                    // Add the language tag next to the separator
                    const langTag = createLanguageTag(
                        topResult.detectedLanguage,
                        topResult.confidence
                    );
                    lastSeparator.appendChild(langTag);
                }
            }
        } catch (error) {
            console.error('Error detecting language:', error);
        }
    }

    // Listen for new content being added to the textarea
    const textArea = document.getElementById('inputText');
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'characterData' || mutation.type === 'childList') {
                const newText = textArea.value;
                detectAndDisplayLanguage(newText);
            }
        });
    });

    observer.observe(textArea, {
        characterData: true,
        childList: true,
        subtree: true
    });

    // Also detect language when files are dropped or pasted
    textArea.addEventListener('input', (e) => {
        const newText = e.target.value;
        detectAndDisplayLanguage(newText);
    });
});