import * as fs from 'fs';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { Command, CommandRunner, Option } from 'nest-commander';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';

import {
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
  AIMessagePromptTemplate,
} from '@langchain/core/prompts';

import {
  FileManagerService,
  LoaderService,
  ModelBuilderService,
  getChangedFiles,
  loadTextFile,
} from '@bxav/cli-utils';
import { CliConfigService } from './cli-config.service';

@Command({ name: 'generate', description: 'Generate new content' })
export class GenerateCommand extends CommandRunner {
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
    options: {
      config: string;
      type: string;
      objective: string;
      output: string;
      commitDiff: string;
    }
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
      `Generating content for ${contentType} with focus on ${contentArea.focus}...`
    );

    const voiceAndEthos = await loadTextFile(contentArea.voiceAndEthos);

    let filePaths = params;
    if (!filePaths.length) {
      filePaths = await getChangedFiles(options.commitDiff || undefined);
      return;
    } else {
      filePaths = await this.fileManager.getFiles(filePaths);
    }

    const fileContents = await this.loadFilesContent(filePaths);

    const content = await this.generateContent(
      fileContents,
      options.objective,
      voiceAndEthos
    );

    console.log('New content:\n', content);
    fs.writeFileSync(options.output, content);
  }

  private async generateContent(
    fileContents: Record<string, string>,
    objective: string,
    voiceAndEthos: string
  ): Promise<string> {
    const model = await this.modelBuilderService.buildModel(
      'OpenAI',
      'gpt-4-1106-preview',
      {
        temperature: 0.7,
      }
    );

    console.log('Generate content...');

    const template = ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(
        `Based on the a given voice and ethos:
        ${voiceAndEthos}

        Give me the content you want me to consider:
        `
      ),
      HumanMessagePromptTemplate.fromTemplate('{content}'),
      AIMessagePromptTemplate.fromTemplate(
        'I will give you direclty the content you want me to consider in the next message. But first what is the objective of the content you want me to generate?'
      ),
      HumanMessagePromptTemplate.fromTemplate('{objective}'),
    ]);
    const outputParser = new StringOutputParser();
    const chain = RunnableSequence.from([template, model, outputParser]);

    const load = this.loaderService.createLoader({
      text: 'Generate content...',
    });

    const newContent = await chain.invoke({
      content: Object.entries(fileContents).map(([filePath, content]) => `${filePath}:\n\`\`\`\n${content}\n\`\`\``).join('\n\n'),
      objective,
    });

    load.stop();

    return newContent;
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

  @Option({
    flags: '--objective [objective]',
    description: 'Specify the type of document to enhance',
  })
  parseObjective(val: string) {
    return val;
  }

  @Option({
    flags: '-o, --output [path]',
    description: 'Path to the output file',
  })
  parseOutput(val: string) {
    return val;
  }

  @Option({
    flags: '-c, --commit-diff [commitDiff]',
    description: 'The commit diff to use for the refactor',
  })
  parseCommitDiff(val: string) {
    return val;
  }
}
