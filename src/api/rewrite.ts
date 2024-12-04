export async function rewriteSavedPages(savedPages: string[], userInput: string): Promise<string> {
  try {
    // Create the rewriter instance
    //@ts-ignore
    const rewriter = await ai.rewriter.create();

    // Combine all saved pages into one input
    const combinedContext = savedPages.join("\n\n") + "\n\nUser Input: " + userInput;

    // Use the streaming rewriter API
    const stream = await rewriter.rewriteStreaming(combinedContext, {
      context: "Refine the content using saved pages for better response. Maintain the original intent of the user input.",
    });

    let result = '';
    for await (const chunk of stream) {
      result += chunk;
    }

    // Destroy the rewriter instance
    rewriter.destroy();
    return result;
  } catch (error) {
    console.error('Error in rewriteSavedPages:', error);
    throw error;
  }
}

export async function rewriteText(userInput: string): Promise<string> {
  try {
    //@ts-ignore
    const rewriter = await ai.rewriter.create();

    const combinedContext =  userInput;

    const stream = await rewriter.rewriteStreaming(combinedContext, {
      context: ` Rewrite the following sentence to improve clarity, grammar, and overall flow while preserving its original meaning : ${userInput}`,
    });

    let result = '';
    for await (const chunk of stream) {
      result += chunk;
    }

    // Destroy the rewriter instance
    rewriter.destroy();
    return result;
  } catch (error) {
    console.error('Error in rewriteSavedPages:', error);
    throw error;
  }
}
