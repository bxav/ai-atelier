import * as fs from 'fs';
import {
  Command,
  CommandRunner,
  InquirerService,
  Option,
} from 'nest-commander';

import {
  FileManagerService,
  LoaderService,
  ModelBuilderService,
  getChangedFiles,
  loadTextFile,
} from '@bxav/cli-utils';
import { WriterWithReflectionAgent } from '@bxav/node-ai-agents';
import { CliConfigService } from './cli-config.service';

@Command({
  name: 'create',
  description: 'Create new content',
})
export class CreateCommand extends CommandRunner {
  constructor(
    private readonly configService: CliConfigService,
    private readonly modelBuilderService: ModelBuilderService,
    private readonly fileManager: FileManagerService,
    private readonly inquirer: InquirerService,
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

    if (!this.configService.validate(config)) {
      console.error('Fix your configuration file.');
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

    console.log(`Generating content for ${contentType}...`);

    const objective = await this.promptForObjective();

    console.log('Objective:', objective);

    let filePaths = params;

    if (filePaths.length) {
      filePaths = await this.fileManager.getFiles(filePaths);
    }

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

    if (contentArea.strategy === 'reflection') {
      const agent = new WriterWithReflectionAgent({
        model,
        writerPrompt: contentArea.options.writerPrompt,
        reviewerPrompt: contentArea.options.reviewerPrompt,
      });

      const [post, messages] = await agent.createContent(
        [objective, Object.values(fileContents).join('\n')].filter(Boolean)
      );

      console.log(post);
    }

    load.stop();
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
    flags: '-c, --commit-diff [commitDiff]',
    description: 'The commit diff to use for the refactor',
  })
  parseCommitDiff(val: string) {
    return val;
  }

  async promptForObjective(): Promise<string> {
    const { objective } = await this.inquirer.ask<{ objective: string }>(
      'ask-objective-questions',
      undefined
    );
    return objective;
  }
}
