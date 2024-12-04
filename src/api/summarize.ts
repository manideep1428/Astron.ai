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
    console.log("Summarizing full text..." + text)
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
    console.error("Error in summarizeFullText:", error);
    throw error;
  }
}
export async function summarizePageContentWithTitle(
  pageContent: string
): Promise<{ title: string; content: string }> {
  try {
    //@ts-ignore
    const capabilities = await ai.summarizer.capabilities();
    if (capabilities.available !== "readily") {
      throw new Error("Summarizer is not available. Ensure setup is correct.");
    }
    const MAX_TOKENS = 4096; 
    //@ts-ignore
    const summarizer = await ai.summarizer.create();
    const chunks = [];
    for (let i = 0; i < pageContent.length; i += MAX_TOKENS) {
      chunks.push(pageContent.slice(i, i + MAX_TOKENS));
    }

    // Summarize each chunk
    const chunkSummaries = [];
    for (const chunk of chunks) {
      const summary = await summarizer.summarize(chunk);
      chunkSummaries.push(summary);
    }

    summarizer.destroy();

    const combinedSummary = chunkSummaries.join("\n");

    if (combinedSummary.length > MAX_TOKENS) {
      return summarizePageContentWithTitle(combinedSummary);
    }

    const title = await generateTitleFromSummary(combinedSummary);

    return { title, content: combinedSummary };
  } catch (error: any) {
    console.error("Error in summarizePageContentWithTitle:", error);
    throw new Error(`Summarization failed: ${error.message}`);
  }
}

async function generateTitleFromSummary(summary: string): Promise<string> {
  try {
    //@ts-ignore
    const titleGenerator = await ai.summarizer.create();

    const title = await titleGenerator.summarize(
      `Generate a concise and informative title for this content: ${summary}`
    );
    titleGenerator.destroy();
    return title;
  } catch (error: any) {
    console.error("Error in generating title:", error);
    return "Untitled Summary"; 
  }
}
