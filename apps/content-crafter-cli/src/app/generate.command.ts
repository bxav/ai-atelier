import * as fs from 'fs';
import * as path from 'path';
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { Command, CommandRunner, Option } from 'nest-commander';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';

import { loadConfig } from './utils';

interface BasicCommandOptions {
  config?: string;
  input?: any;
  topic?: string;
}

@Command({ name: 'generate', description: 'Generate Content' })
export class GenerateCommand extends CommandRunner {
  constructor() {
    super();
  }

  private async createContent(
    model: any,
    input: string,
    promptTemplate: string
  ): Promise<string> {
    const template = ChatPromptTemplate.fromTemplate(promptTemplate);

    const outputParser = new StringOutputParser();

    const chain = RunnableSequence.from([template, model, outputParser]);

    const result = await chain.invoke({ input });
    return result;
  }

  private saveToFile(fileName: string, content: string): void {
    const outputDir = './_output';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    fs.writeFileSync(path.join(outputDir, fileName), content);
  }

  async run(
    _passedParam: string[],
    options?: BasicCommandOptions
  ): Promise<void> {
    const { longPrompt, smallPrompt, elevatorPitchPrompt } = loadConfig(
      path.join(__dirname, 'assets', 'pitches.yaml')
    );

    const { topic } = options;

    const model = new ChatOpenAI({
      modelName: 'gpt-4-1106-preview',
    });

    const longPitch = await this.createContent(model, topic, longPrompt);
    console.log(longPitch);
    this.saveToFile('long-pitch.md', longPitch);

    const smallPitch = await this.createContent(model, longPitch, smallPrompt);
    console.log(smallPitch);
    this.saveToFile('small-pitch.md', smallPitch);

    const elevatorPitch = await this.createContent(
      model,
      smallPitch,
      elevatorPitchPrompt
    );
    console.log(elevatorPitch);
    this.saveToFile('elevator-pitch.md', elevatorPitch);
  }

  @Option({
    flags: '-t, --topic [topic]',
    description: 'Topic',
  })
  parseTopic(val: string): string {
    return val;
  }
}
