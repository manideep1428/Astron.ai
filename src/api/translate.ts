export async function detectLanguage(text: string): Promise<string> {
    try {
        //@ts-ignore
      const detector = await translation.createDetector();
      const results = await detector.detect(text);
      const topResult = results[0];
      return topResult.detectedLanguage || 'unknown';
    } catch (error: any) {
      throw new Error(`Language detection error: ${error.message}`);
    }
  }
  
  export async function translateText(text: string, targetLanguage: string): Promise<string> {
    try {
      const sourceLanguage = await detectLanguage(text);
      if (sourceLanguage === 'unknown') {
        throw new Error("Unable to detect source language");
      }
            
      //@ts-ignore
      const canTranslate = await translation.canTranslate({ sourceLanguage, targetLanguage });
      if (canTranslate !== 'readily') {
        throw new Error(`Translation not available for ${sourceLanguage} to ${targetLanguage}`);
      }
      //@ts-ignore
      const translator = await translation.createTranslator({ sourceLanguage, targetLanguage });
      const result = await translator.translate(text);
      return result;
    } catch (error: any) {
      throw new Error(`Translation error: ${error.message}`);
    }
  }
  