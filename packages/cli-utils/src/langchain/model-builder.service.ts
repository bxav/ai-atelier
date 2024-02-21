import { ChatOpenAI } from '@langchain/openai';
import { ChatMistralAI } from '@langchain/mistralai';
import { Injectable } from '@nestjs/common';
import { InquirerService } from 'nest-commander';

@Injectable()
export class ModelBuilderService {
  constructor(private readonly inquirer: InquirerService) {}

  async buildModel(modelType: string, modelName: string, options: any) {
    switch (modelType) {
      case 'OpenAI':
        return new ChatOpenAI({
          modelName,
          openAIApiKey:
            process.env['OPENAI_API_KEY'] || (await this.promptForOpenaiKey()),
          ...options,
        });
      case 'Mistral':
        return new ChatMistralAI({
          apiKey: process.env['MISTRAL_API_KEY'],
          modelName,
        });
      default:
        throw new Error(`Unsupported model type: ${modelType}`);
    }
  }

  async promptForOpenaiKey(): Promise<string> {
    const { openaiKey } = await this.inquirer.ask<{ openaiKey: string }>(
      'ask-openai-key-questions',
      undefined
    );
    return openaiKey;
  }
}
