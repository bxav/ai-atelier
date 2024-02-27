import { RunnableLike } from '@langchain/core/runnables';

import { Injectable } from '@nestjs/common';
import { CodeLinterAgent } from './code-linter-agent';

@Injectable()
export class CodeLinterAgentService {
  constructor() {}

  async refactorFile(
    model: RunnableLike,
    fileContents: Record<string, string>,
    {
      prompt,
      role,
      codingStyles,
      examples,
    }: { prompt: string; role: string; codingStyles: string; examples: string }
  ): Promise<Record<string, string>> {
    const agent = new CodeLinterAgent({
      model,
      prompt,
      role,
      codingStyles,
      examples,
    });

    return {
      [Object.keys(fileContents)[0]]: await agent.refactorFile(
        fileContents[Object.keys(fileContents)[0]]
      ),
    };
  }
}
