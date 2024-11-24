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
  
  