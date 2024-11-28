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


export async function promptWithAI(input: string): Promise<string> {
  try {
    //@ts-ignore
    const capabilities = await ai.languageModel.capabilities();
    
    if (capabilities.available === 'no') {
      throw new Error('AI language model is not available');
    }
        //@ts-ignore
    const session = await ai.languageModel.create();

    const result = await session.prompt(input);

    session.destroy();

    return result;
  } catch (error) {
    console.error('Error in promptWithAI:', error);
    throw error;
  }
}

export async function promptWithAIStreaming(input: string, onChunk: (chunk: string) => void) {
  try {
      //@ts-ignore
    const capabilities = await ai.languageModel.capabilities();
    
    if (capabilities.available === 'no') {
      throw new Error('AI language model is not available');
    }

    //@ts-ignore
    const session = await ai.languageModel.create();
    const stream = session.promptStreaming(input);

    let result = '';
    let previousChunk = '';
    for await (const chunk of stream) {
      const newChunk = chunk.startsWith(previousChunk)
        ? chunk.slice(previousChunk.length)
        : chunk;
      
      onChunk(newChunk);
      result += newChunk;
      previousChunk = chunk;
    }

    session.destroy();
    return result;
  } catch (error) {
    console.error('Error in promptWithAIStreaming:', error);
    throw error;
  }
}
