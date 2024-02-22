import * as fs from 'fs';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { Command, CommandRunner, Option } from 'nest-commander';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';

import {
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from '@langchain/core/prompts';

import {
  FileManagerService,
  LoaderService,
  ModelBuilderService,
  loadTextFile,
} from '@bxav/cli-utils';
import { CliConfigService } from './cli-config.service';

@Command({ name: 'enhance', description: 'Enhance content quality' })
export class EnhanceCommand extends CommandRunner {
  constructor(
    private readonly modelBuilderService: ModelBuilderService,
    private readonly configService: CliConfigService,
    private readonly fileManager: FileManagerService,
    private readonly loaderService: LoaderService
  ) {
    super();
  }

  async run(
    params: string[],
    options: { config: string; type: string }
  ): Promise<void> {
    const config = await this.configService.loadConfig(options.config);
    if (!config) {
      console.warn(
        'Failed to load configuration.\nPlease run `content-crafter init` to initialize ContentCrafter.'
      );
      return;
    }

    const contentAreas = config.contentAreas;
    if (!contentAreas) {
      console.error('No content areas configured.');
      return;
    }

    const contentType = options.type || Object.keys(config.contentAreas)[0];
    const contentArea = config.contentAreas[contentType];

    if (!contentArea) {
      console.error('No content area found for type:', contentType);
      return;
    }

    console.log(
      `Enhancing content for ${contentType} with focus on ${contentArea.focus}...`
    );

    const voiceAndEthos = await loadTextFile(contentArea.voiceAndEthos);

    let filePaths = params;
    if (!filePaths.length) {
      console.error('No files specified for enhancement.');
      return;
    } else {
      filePaths = await this.fileManager.getFiles(filePaths);
    }

    filePaths = filePaths.filter((filePath) =>
      (contentArea.pattern as string)
        .split(',')
        .some((p) => filePath.endsWith(p.trim()))
    );

    const fileContents = await this.loadFilesContent(filePaths);

    const newFileContents = await this.enhanceContent(
      fileContents,
      voiceAndEthos
    );

    await this.writeNewContents(newFileContents);
  }

  private async enhanceContent(
    fileContents: Record<string, string>,
    voiceAndEthos: string
  ): Promise<Record<string, string>> {
    const model = await this.modelBuilderService.buildModel(
      'OpenAI',
      'gpt-4-1106-preview',
      {
        temperature: 0.7,
      }
    );

    console.log('Enhancing content...', voiceAndEthos);

    const template = ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(
        `Based on the a given voice and ethos:
        ${voiceAndEthos}

        Enter the content you want to enhance:
        `
      ),
      HumanMessagePromptTemplate.fromTemplate('{input}'),
    ]);
    const outputParser = new StringOutputParser();
    const chain = RunnableSequence.from([template, model, outputParser]);

    const load = this.loaderService.createLoader({
      text: 'Enhancing content...',
    });

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

  private async loadFilesContent(
    filePaths: string[]
  ): Promise<Record<string, string>> {
    const contents: Record<string, string> = {};
    for (const filePath of filePaths) {
      contents[filePath] = await loadTextFile(filePath);
    }
    return contents;
  }

  private async writeNewContents(
    newFileContents: Record<string, string>
  ): Promise<void> {
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

  @Option({
    flags: '--type [type]',
    description: 'Specify the type of document to enhance',
  })
  parseType(val: string) {
    return val;
  }
}
