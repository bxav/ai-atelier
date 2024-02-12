import { ChatMistralAI } from '@langchain/mistralai';
import { ChatOpenAI } from '@langchain/openai';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ModelBuilderService {
  buildModel(modelType: string, modelName: string, options: any) {
    switch (modelType) {
      case 'OpenAI':
        return new ChatOpenAI({
          modelName,
          ...options,
        });
      case 'Mistral':
        return new ChatMistralAI({
          apiKey: process.env.MISTRAL_API_KEY,
          modelName,
        });
      default:
        throw new Error(`Unsupported model type: ${modelType}`);
    }
  }
}
