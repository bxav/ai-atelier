import * as fs from 'fs';
import * as path from 'path';
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import {
  Command,
  CommandRunner,
  Option,
} from 'nest-commander';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import * as yaml from 'js-yaml';

import {
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from '@langchain/core/prompts';

const loading = require('loading-cli');

import { loadConfig, loadTextFile } from '@bxav/cli-utils';

function getFilesRecursively(directory: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(directory);
  list.forEach((file) => {
    file = path.resolve(directory, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(file));
    } else {
      results.push(file);
    }
  });
  return results;
}

@Command({ name: 'enhance', description: 'Enhance content quality' })
export class EnhanceCommand extends CommandRunner {
  async run(params: string[], options: { config: string }): Promise<void> {
    const config = this.loadConfig(options.config);
    if (!config) {
      console.error('Failed to load configuration.');
      return;
    }

    const contentAreas = config.contentAreas;
    if (!contentAreas) {
      console.error('No content areas configured.');
      return;
    }

    console.log('Enhancing content files...');

    let filePaths = params;
    if (!filePaths.length) {
      console.error('No files specified for enhancement.');
      return;
    }

    let allFiles: string[] = [];
    filePaths.forEach((filePath) => {
      if (fs.statSync(filePath).isDirectory()) {
        allFiles = allFiles.concat(getFilesRecursively(filePath));
      } else {
        allFiles.push(filePath);
      }
    });

    const fileContents = await this.loadFilesContent(allFiles);

    const newFileContents = await this.enhanceContent(fileContents, contentAreas);

    await this.writeNewContents(newFileContents);
  }

  private loadConfig(customConfigPath?: string): any {
    try {
      const configPath = customConfigPath || path.join(process.cwd(), '.contentcrafter', 'config.yml');
      const configFile = fs.readFileSync(configPath, 'utf8');
      return yaml.load(configFile);
    } catch (error) {
      console.error('Error loading config file:', error);
      return null;
    }
  }

  private async enhanceContent(
    fileContents: Record<string, string>,
    contentAreas: any
  ): Promise<Record<string, string>> {
    const model = new ChatOpenAI({
      modelName: 'gpt-4-1106-preview',
      temperature: 0.7,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const template = ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(`Enhance the following content to improve clarity, engagement, and alignment with the specified writing style:`),
      HumanMessagePromptTemplate.fromTemplate('{input}'),
    ]);
    const outputParser = new StringOutputParser();
    const chain = RunnableSequence.from([template, model, outputParser]);

    const load = this.startLoadingAnimation();

    const newFileContents = await chain.batch(
      Object.entries(fileContents).map(([filePath, content]) => ({
        input: content,
      })),
      {
        maxConcurrency: 5,
      }
    );

    load.stop();
    return Object.keys(fileContents).reduce((acc, filePath, index) => {
      acc[filePath] = newFileContents[index];
      return acc;
    }, {});
  }

  private async loadFilesContent(filePaths: string[]): Promise<Record<string, string>> {
    const contents: Record<string, string> = {};
    for (const filePath of filePaths) {
      contents[filePath] = await loadTextFile(filePath);
    }
    return contents;
  }

  private startLoadingAnimation() {
    return loading({
      text: 'Enhancing content...',
      color: 'green',
      interval: 80,
      stream: process.stdout,
    }).start();
  }

  private async writeNewContents(newFileContents: Record<string, string>): Promise<void> {
    for (const [filePath, content] of Object.entries(newFileContents)) {
      fs.writeFileSync(filePath, content);
    }
  }

  @Option({
    flags: '--config [path]',
    description: 'Path to a custom ContentCrafter configuration file',
  })
  parseConfig(val: string) {
    return val;
  }
}
