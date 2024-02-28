import * as fs from 'fs';
import { Command, CommandRunner, Option } from 'nest-commander';


import {
  FileManagerService,
  LoaderService,
  ModelBuilderService,
  getChangedFiles,
  loadTextFile,
} from '@bxav/cli-utils';
import { CliConfigService } from './cli-config.service';
import { SmartCorrectorService } from './smart-corrector.service';

@Command({ name: 'smart-corrector', description: 'Smart corrector' })
export class SmartCorrectorCommand extends CommandRunner {
  constructor(
    private readonly configService: CliConfigService,
    private readonly smartCorrectorService: SmartCorrectorService,
    private readonly modelBuilderService: ModelBuilderService,
    private readonly fileManager: FileManagerService,
    private readonly loaderService: LoaderService
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

    if (!this.configService.validate(config)) {
      console.error('Fix your configuration file.');
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

    const newFileContents = await this.smartCorrectorService.refactorFiles(model, fileContents, {
      prompt,
      role: expertConfig.role,
      codingStyles: codingStyles.join('\n'),
      examples: examples.join('\n'),
    });

    await this.writeNewContents(newFileContents);

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
