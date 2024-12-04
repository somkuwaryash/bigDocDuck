const suggestions = {
    'general': [
        "What are the main points?",
        "What is the purpose of this document?",
        "What are the key conclusions?"
    ],
    'legal': [
        "What are the key obligations?",
        "What are the potential liabilities?",
        "What are the important deadlines or dates?"
    ],
    'finance': [
        "What are the key financial metrics?",
        "What are the major risk factors?",
        "What are the revenue trends?"
    ],
    'government': [
        "What are the main policy changes?",
        "Who are the affected stakeholders?",
        "What are the implementation timelines?"
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    const documentType = document.getElementById('documentType');
    const queryInput = document.getElementById('queryInput');
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'flex flex-wrap gap-2 mt-2 mb-6';
    
    // Insert suggestions container after query input
    queryInput.parentNode.insertBefore(suggestionsContainer, queryInput.nextSibling);

    // Function to update suggestions based on document type
    function updateSuggestions(type) {
        suggestionsContainer.innerHTML = '';
        suggestions[type].forEach(suggestion => {
            const pill = document.createElement('button');
            pill.className = 'text-xs px-3 py-1.5 mb-2 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors';
            pill.textContent = suggestion;
            
            pill.addEventListener('click', () => {
                queryInput.value = suggestion;
                // Optional: Add focus to input after selection
                queryInput.focus();
            });
            
            suggestionsContainer.appendChild(pill);
        });
    }

    // Initial suggestions
    updateSuggestions(documentType.value);

    // Update suggestions when document type changes
    documentType.addEventListener('change', (e) => {
        updateSuggestions(e.target.value);
    });
});