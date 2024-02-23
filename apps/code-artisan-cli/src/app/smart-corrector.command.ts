import * as fs from 'fs';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { Command, CommandRunner, Option } from 'nest-commander';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { LLM } from '@langchain/core/language_models/llms';
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
  getChangedFiles,
  loadTextFile,
} from '@bxav/cli-utils';
import { CliConfigService } from './cli-config.service';

@Command({ name: 'smart-corrector', description: 'Smart corrector' })
export class SmartCorrectorCommand extends CommandRunner {
  constructor(
    private readonly configService: CliConfigService,
    private readonly modelBuilderService: ModelBuilderService,
    private readonly fileManager: FileManagerService,
    private loaderService: LoaderService
  ) {
    super();
  }

  async run(
    _params: string[],
    options: {
      commitDiff: string;
      codingStyles: string;
      examples: string;
      config: string;
      expert: string;
    }
  ): Promise<void> {
    const config = await this.configService.loadConfig(options.config);
    if (!config) {
      console.warn(
        'Failed to load configuration.\nPlease run `code-artisan init` to initialize CodeArtisan.'
      );
      return;
    }

    if (Object.keys(config.experts).length === 0) {
      console.error('No experts configured.');
      return;
    }

    const expertName = options.expert || Object.keys(config.experts)[0];
    const expertConfig = config.experts[expertName];

    if (!expertConfig) {
      console.error(`Expert '${expertName}' not found.`);
      return;
    }

    console.log(
      `Processing files with '${expertName}' expert configurations...`
    );

    const prompt = this.configService.loadPrompt();

    const codingStyles = await this.configService.loadCodingStyles(
      expertConfig
    );
    const examples = await this.configService.loadExamples(expertConfig);

    let filePaths = _params;
    if (!filePaths.length) {
      filePaths = await getChangedFiles(options.commitDiff || undefined);
    } else {
      filePaths = await this.fileManager.getFiles(filePaths);
    }

    filePaths = filePaths.filter((filePath) =>
      (expertConfig.pattern as string)
        .split(',')
        .some((p) => filePath.endsWith(p.trim()))
    );

    const fileContents = await this.loadFilesContent(filePaths);

    const modelConfig = config.model || {
      type: 'OpenAI',
      name: 'gpt-4-1106-preview',
      options: {
        temperature: 0,
      },
    };

    const model = await this.modelBuilderService.buildModel(
      modelConfig.type,
      modelConfig.name,
      modelConfig.options
    );

    const load = this.loaderService.createLoader({ text: 'Refactoring...' });

    const newFileContents = await this.refactorFiles(model, fileContents, {
      prompt,
      role: expertConfig.role,
      codingStyles: codingStyles.join('\n'),
      examples: examples.join('\n'),
    });

    await this.writeNewContents(newFileContents);

    load.stop();
  }

  private async refactorFiles(
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
      fs.writeFileSync(
        filePath,
        content.replace(/^```.*\n/, '').replace(/\n```$/, '\n')
      );
    }
  }

  @Option({
    flags: '-c, --commit-diff [commitDiff]',
    description: 'The commit diff to use for the refactor',
  })
  parseCommitDiff(val: string) {
    return val;
  }

  @Option({
    flags: '--config [path]',
    description: 'Path to a custom CodeArtisan configuration file',
  })
  parseConfig(val: string) {
    return val;
  }

  @Option({
    flags: '--expert [name]',
    description: 'Specify the expert to use for linting',
  })
  parseExpert(val: string) {
    return val;
  }
}
