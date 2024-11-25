export async function chatWithAI(prompt: string): Promise<string> {
    try {
        //@ts-ignore
      const capabilities = await ai.languageModel.capabilities();
      if (capabilities.available !== "readily") {
        throw new Error("Language model is not available. Ensure setup is correct.");
      }
    //@ts-ignore
      const session = await ai.languageModel.create();
      const result = await session.prompt(prompt);
      session.destroy();
      return result;
    } catch (error: any) {
      throw new Error(`Chat error: ${error.message}`);
    }
  }
  
  