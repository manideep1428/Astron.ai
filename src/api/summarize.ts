export async function summarizeText(text: string): Promise<string> {
    try {
        //@ts-ignore
      const capabilities = await ai.summarizer.capabilities();
      if (capabilities.available !== "readily") {
        throw new Error("Summarizer is not available. Ensure setup is correct.");
      }
    //@ts-ignore
      const summarizer = await ai.summarizer.create();
      const result = await summarizer.summarize(text);
      summarizer.destroy();
      return result;
    } catch (error: any) {
      throw new Error(`Summarization error: ${error.message}`);
    }
  }
  


  export async function summarizeTextPage(text: string): Promise<string> {
    try {
      //@ts-ignore
      const canSummarize = await ai.summarizer.capabilities();
      
      if (canSummarize.available === 'no') {
        throw new Error('Summarization is not available');
      }
  
      const MAX_TOKENS = 4096; 
      if (text.length > MAX_TOKENS) {
        text = text.slice(0, MAX_TOKENS);
        
      }
          //@ts-ignore
      const summarizer = await ai.summarizer.create();
      
      const result = await summarizer.summarize(text);
      
      summarizer.destroy();
  
      return result;
    } catch (error) {
      console.error('Error in summarizeText:', error);
      throw error;
    }
  }
  