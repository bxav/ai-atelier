import { ChatPromptTemplate } from '@langchain/core/prompts';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { LLM } from '@langchain/core/language_models/llms';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';

import {
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from '@langchain/core/prompts';

import { Injectable } from '@nestjs/common';

@Injectable()
export class SmartCorrectorService {
  constructor() {}
  async refactorFiles(
    model: BaseChatModel | LLM,
    fileContents: Record<string, string>,
    {
      prompt,
      role,
      codingStyles,
      examples,
    }: { prompt: string; role: string; codingStyles: string; examples: string }
  ): Promise<Record<string, string>> {
    const template = ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(prompt),
      HumanMessagePromptTemplate.fromTemplate(
        `Please, refactor the following code and respond directly to this message with the refactored code without adding markdown around. Here is the code to refactor:`
      ),
      HumanMessagePromptTemplate.fromTemplate('{input}'),
    ]);
    const outputParser = new StringOutputParser();
    const chain = RunnableSequence.from([template, model, outputParser]);

    const newFileContents = await chain.batch(
      Object.entries(fileContents).map(([filePath, content]) => ({
        codingStyles,
        examples,
        role,
        input: content,
      })),
      {
        maxConcurrency: 5,
      }
    );

    return Object.keys(fileContents).reduce((acc, filePath, index) => {
      acc[filePath] = newFileContents[index];
      return acc;
    }, {});
  }
}
