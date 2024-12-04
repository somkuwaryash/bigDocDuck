document.addEventListener('DOMContentLoaded', async function() {
    const summarizeBtn = document.getElementById('summarizeBtn');
    const inputText = document.getElementById('inputText');
    const documentType = document.getElementById('documentType');
    const queryInput = document.getElementById('queryInput');
    const resultDiv = document.getElementById('result');
  
    // Check if Gemini Nano is available
    let summarizer = null;
  
    async function initializeSummarizer() {
      try {
        const canSummarize = await ai.summarizer.capabilities();
        
        if (canSummarize && canSummarize.available !== 'no') {
          summarizer = await ai.summarizer.create();
          
          if (canSummarize.available === 'downloading') {
            summarizer.addEventListener('downloadprogress', (e) => {
              resultDiv.textContent = `Loading model: ${Math.round((e.loaded / e.total) * 100)}%`;
            });
            await summarizer.ready;
          }
          
          return true;
        } else {
          resultDiv.textContent = "Summarizer is not available on this device.";
          return false;
        }
      } catch (error) {
        resultDiv.textContent = "Error initializing summarizer: " + error.message;
        return false;
      }
    }
  
    // Initialize on popup load
    await initializeSummarizer();
  
    summarizeBtn.addEventListener('click', async () => {
      const text = inputText.value.trim();
      const type = documentType.value;
      const query = queryInput.value.trim();
  
      if (!text) {
        resultDiv.textContent = "Please enter some text to summarize.";
        return;
      }
  
      if (!summarizer) {
        if (!await initializeSummarizer()) {
          return;
        }
      }
  
      try {
        resultDiv.textContent = "Processing...";
  
        // Construct prompt based on document type and query
        let prompt = `Summarize this ${type} document`;
        if (query) {
          prompt += ` focusing on: ${query}`;
        }
  
        const result = await summarizer.summarize(text, {
          prompt: prompt,
          documentType: type
        });
  
        resultDiv.textContent = result;
      } catch (error) {
        resultDiv.textContent = "Error generating summary: " + error.message;
      }
    });
  
    // Cleanup when popup closes
    window.addEventListener('unload', () => {
      if (summarizer) {
        summarizer.destroy();
      }
    });
  });
