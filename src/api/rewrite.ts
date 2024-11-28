export async function rewriteText(text: string, context?: string): Promise<string> {
  try {
      //@ts-ignore
    const rewriter = await ai.rewriter.create();
    const result = await rewriter.rewrite(text, { 
      context: context || 'Rewrite the text while maintaining its original meaning' 
    });
    rewriter.destroy();
    return result;
  } catch (error) {
    console.error('Error in rewriteText:', error);
    throw error;
  }
}