// Document upload and processing functionality
document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.createElement('div');
    dropZone.className = 'border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4 text-center hover:border-blue-500 transition-colors';
    dropZone.innerHTML = `
        <div class="space-y-2">
            <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <div class="text-sm text-gray-600">
                Drop files here or
                <label class="text-blue-600 hover:text-blue-700 cursor-pointer">
                    <span>browse</span>
                    <input type="file" class="hidden" accept=".txt,.doc,.docx,.pdf" multiple>
                </label>
            </div>
            <p class="text-xs text-gray-500">Supports: TXT, DOC, DOCX, PDF</p>
        </div>
    `;

    // Insert dropzone before the existing textarea
    const textArea = document.getElementById('inputText');
    textArea.parentNode.insertBefore(dropZone, textArea);

    // Handle file drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('border-blue-500');
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.classList.remove('border-blue-500');
    });

    dropZone.addEventListener('drop', async (e) => {
        e.preventDefault();
        dropZone.classList.remove('border-blue-500');
        
        const files = e.dataTransfer.files;
        await handleFiles(files);
    });

    // Handle file selection via button
    const fileInput = dropZone.querySelector('input[type="file"]');
    fileInput.addEventListener('change', async (e) => {
        await handleFiles(e.target.files);
    });

    async function handleFiles(files) {
        for (const file of files) {
            try {
                const text = await readFileContent(file);
                // Append the text to the existing textarea with a file separator
                const currentText = textArea.value;
                const separator = currentText ? 
                `\n\n<div class="file-separator inline-block">--- ${file.name} ---</div>\n\n` : 
                `<div class="file-separator inline-block">--- ${file.name} ---</div>\n\n`;
                            textArea.value = currentText + separator + text;
            } catch (error) {
                console.error('Error reading file:', error);
                showError('Error reading file: ' + file.name);
            }
        }
    }

    async function readFileContent(file) {
        if (file.type === 'text/plain') {
            return await file.text();
        } else {
            // For now, just show an error for unsupported file types
            throw new Error('Unsupported file type: ' + file.type);
            // TODO: Add support for DOC, DOCX, PDF using appropriate libraries
        }
    }

    function showError(message) {
        const errorDiv = document.getElementById('error');
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
        setTimeout(() => {
            errorDiv.classList.add('hidden');
        }, 5000);
    }
});