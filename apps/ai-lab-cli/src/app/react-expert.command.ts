import * as fs from 'fs';
import * as path from 'path';
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import {
  Command,
  CommandRunner,
  InquirerService,
  Option,
} from 'nest-commander';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';

import { loadConfig } from './utils';

function loadTextFile(filePath: string): string {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return fileContent;
  } catch (error) {
    console.error('Error reading or parsing Markdown file:', error);
  }
}

@Command({ name: 'react-expert', description: 'React Expert' })
export class ReactExpertCommand extends CommandRunner {
  constructor(private readonly inquirer: InquirerService) {
    super();
  }

  async run(passedParam: string[], options: { input?: string }): Promise<void> {
    const prompt = loadConfig(
      path.join(__dirname, 'assets', 'react-expert.md')
    );

    const filePath = passedParam[0] || (await this.promptForPath());
    const objective = options.input || (await this.promptForObjective());

    const fileContent = loadTextFile(filePath);

    const model = new ChatOpenAI({
      modelName: 'gpt-4-1106-preview',
    });

    const template = ChatPromptTemplate.fromTemplate(prompt);

    const outputParser = new StringOutputParser();

    const chain = RunnableSequence.from([template, model, outputParser]);

    const result = await chain.invoke({
      input: `${objective};

    For the component:
    ---
    ${fileContent}
    ---
    `,
    });
    console.log(result);
  }

  @Option({
    flags: '-i, --input [string]',
    description: 'Your objective',
  })
  parseInput(val: string): string {
    return val;
  }

  async promptForPath(): Promise<string> {
    const { path } = await this.inquirer.ask<{ path: string }>(
      'ask-path-questions',
      undefined
    );
    return path;
  }

  async promptForObjective(): Promise<string> {
    const { objective } = await this.inquirer.ask<{ objective: string }>(
      'ask-objective-questions',
      undefined
    );
    return objective;
  }
}
