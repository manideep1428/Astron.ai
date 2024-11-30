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

export async function summarizeFullText(text: string): Promise<string> {
  try {
    //@ts-ignore
    const capabilities = await ai.summarizer.capabilities();
    if (capabilities.available !== "readily") {
      throw new Error("Summarizer is not available. Ensure setup is correct.");
    }

    const MAX_TOKENS = 4096; // Adjust to the API limit
    //@ts-ignore
    const summarizer = await ai.summarizer.create();

    const chunks = [];
    for (let i = 0; i < text.length; i += MAX_TOKENS) {
      chunks.push(text.slice(i, i + MAX_TOKENS));
    }

    const chunkSummaries = [];
    for (const chunk of chunks) {
      const summary = await summarizer.summarize(chunk);
      chunkSummaries.push(summary);
    }

    summarizer.destroy();

    const combinedSummary = chunkSummaries.join("\n");
    if (combinedSummary.length > MAX_TOKENS) {
      return summarizeFullText(combinedSummary); 
    }

    return combinedSummary;
  } catch (error: any) {
    console.error('Error in summarizeFullText:', error);
    throw error;
  }
}
