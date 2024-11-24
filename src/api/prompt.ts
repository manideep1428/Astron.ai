export async function defineText(text: string): Promise<string> {
    try {
        //@ts-ignore
      const capabilities = await ai.languageModel.capabilities();
      if (capabilities.available !== "readily") {
        throw new Error("Language model is not available. Ensure setup is correct.");
      }
        //@ts-ignore
      const session = await ai.languageModel.create();
      const prompt = `Define the meaning of this word or phrase and add an example that even a 10-year-old can understand. 
        The output should look like this: 
        Definition: ---------------
        Example to understand: "" 
        Word or phrase: "${text}"`;
  
      const result = await session.prompt(prompt);
      session.destroy();
      return result;
    } catch (error: any) {
      throw new Error(`Definition error: ${error.message}`);
    }
  }
  