export async function rewriteText(text: string): Promise<string> {
    try {
      // Check if the rewriter API is available
      //@ts-ignore
      const capabilities = await ai.rewriter.capabilities();
      if (capabilities.available !== "readily") {
        throw new Error("Rewriter API is not available");
      }
  
      // Create a rewriter instance
      //@ts-ignore
      const rewriter = await ai.rewriter.create({
        tone: "neutral",
        format: "plain-text",
        length: "as-is"
      });
  
      // Rewrite the text
      const result = await rewriter.rewrite(text, {
        context: "Rewrite the text in a different style while maintaining its meaning."
      });
  
      // Destroy the rewriter instance
      rewriter.destroy();
  
      return result;
    } catch (error) {
      console.error("Error in rewriteText:", error);
      throw new Error("Failed to rewrite the text");
    }
  }
  
  