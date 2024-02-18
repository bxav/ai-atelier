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
import * as yaml from 'js-yaml';
const loading = require('loading-cli');

import { getChangedFiles, loadConfig, loadTextFile } from '@bxav/cli-utils';

function getFilesRecursively(directory: string): string[] {
  let results: string[] = [];

  const list = fs.readdirSync(directory);
  list.forEach((file) => {
    file = path.join(directory, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      /* Recurse into a subdirectory */
      results = results.concat(getFilesRecursively(file));
    } else {
      /* Is a file */
      if (file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

@Command({ name: 'smart-corrector', description: 'Smart corrector' })
export class SmartCorrectorCommand extends CommandRunner {
  constructor(private readonly inquirer: InquirerService) {
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
    const config = this.loadConfig(options.config);
    if (!config) {
      console.error('Failed to load configuration.');
      return;
    }

    if (Object.keys(config.experts).length === 0) {
      console.error('No experts configured.');
      return;
    }

    const expertName = options.expert || Object.keys(config.experts)[0];
    const expertConfig = config.experts[expertName]

    if (!expertConfig) {
      console.error(`Expert '${expertName}' not found.`);
      return;
    }

    console.log(
      `Processing files with '${expertName}' expert configurations...`
    );

    const codingStyles = this.loadCodingStyles(expertConfig);
    const examples = this.loadExamples(expertConfig);

    const [prompt] = await Promise.all([this.loadAsset('expert-prompt.md')]);

    let filePaths = _params;
    if (!filePaths.length) {
      filePaths = await getChangedFiles(options.commitDiff || undefined);
    } else {
      // Modify this part
      let allFiles: string[] = [];
      filePaths.forEach((path) => {
        if (fs.statSync(path).isDirectory()) {
          allFiles = allFiles.concat(getFilesRecursively(path));
        } else {
          allFiles.push(path);
        }
      });
      filePaths = allFiles;
    }

    filePaths = filePaths.filter((path) => path.endsWith('.tsx'));

    const fileContents = await this.loadFilesContent(filePaths);

    const newFileContents = await this.refactorFiles(fileContents, {
      prompt,
      role: expertConfig.role,
      codingStyles: codingStyles.join('\n'),
      examples: examples.join('\n'),
    });

    await this.writeNewContents(newFileContents);
  }

  private loadConfig(customConfigPath?: string): any {
    try {
      const configPath =
        customConfigPath ||
        path.join(process.cwd(), '.codeartisan', 'config.yml');
      const configFile = fs.readFileSync(configPath, 'utf8');
      return yaml.load(configFile);
    } catch (error) {
      console.error('Error loading config file:', error);
      return null;
    }
  }

  private loadExamples(expertConfig: any): string[] {
    let examples: string[] = [];
    if (expertConfig.examples && expertConfig.examples.length > 0) {
      expertConfig.examples.forEach((examplePath: { path: string }) => {
        const fullPath = path.join(process.cwd(), examplePath.path);
        if (fs.existsSync(fullPath)) {
          // Read the content of the example file
          const content = fs.readFileSync(fullPath, 'utf8');
          examples.push(content);
        } else {
          console.error(`Coding example not found: ${fullPath}`);
        }
      });
    } else {
      console.log('No examples configured for this expert.');
    }
    return examples;
  }

  private loadCodingStyles(expertConfig: any): string[] {
    let codingStyles: string[] = [];
    if (expertConfig.codingStyles && expertConfig.codingStyles.length > 0) {
      expertConfig.codingStyles.forEach((stylePath: { path: string }) => {
        const fullPath = path.join(process.cwd(), stylePath.path);
        if (fs.existsSync(fullPath)) {
          // Read the content of the coding style file
          const content = fs.readFileSync(fullPath, 'utf8');
          codingStyles.push(content);
        } else {
          console.error(`Coding style file not found: ${fullPath}`);
        }
      });
    } else {
      console.log('No coding styles configured for this expert.');
    }
    return codingStyles;
  }

  private async refactorFiles(
    fileContents: Record<string, string>,
    {
      prompt,
      role,
      codingStyles,
      examples,
    }: { prompt: string; role: string,  codingStyles: string; examples: string }
  ): Promise<Record<string, string>> {
    const model = new ChatOpenAI({
      modelName: 'gpt-4-1106-preview',
      openAIApiKey:
        process.env.OPENAI_API_KEY || (await this.promptForOpenaiKey()),
    });

    const template = ChatPromptTemplate.fromTemplate(prompt);
    const outputParser = new StringOutputParser();
    const chain = RunnableSequence.from([template, model, outputParser]);

    const load = this.startLoadingAnimation();

    const newFileContents = await chain.batch(
      Object.entries(fileContents).map(([filePath, content]) => ({
        codingStyles,
        examples,
        role,
        input: content,
      }))
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

  private async loadAsset(
    fileName: string,
    overridePath?: string
  ): Promise<string> {
    return loadConfig(overridePath ?? path.join(__dirname, 'assets', fileName));
  }

  private startLoadingAnimation() {
    return loading({
      text: 'Refactoring...',
      color: 'yellow',
      interval: 80,
      stream: process.stdout,
      frames: [
        '▐⠂               ▌',
        '▐⠈               ▌',
        '▐ ⠂              ▌',
        '▐ ⠠              ▌',
        '▐  ⡀             ▌',
        '▐  ⠠             ▌',
        '▐   ⠂            ▌',
        '▐   ⠈            ▌',
        '▐    ⠂           ▌',
        '▐    ⠠           ▌',
        '▐     ⡀          ▌',
        '▐     ⠠          ▌',
        '▐      ⠂         ▌',
        '▐      ⠈         ▌',
        '▐       ⠂        ▌',
        '▐       ⠠        ▌',
        '▐        ⡀       ▌',
        '▐        ⠠       ▌',
        '▐         ⠂      ▌',
        '▐         ⠈      ▌',
        '▐          ⠂     ▌',
        '▐          ⠠     ▌',
        '▐           ⡀    ▌',
        '▐           ⠠    ▌',
        '▐            ⠂   ▌',
        '▐            ⠈   ▌',
        '▐             ⠂  ▌',
        '▐             ⠠  ▌',
        '▐              ⡀ ▌',
        '▐              ⠠ ▌',
        '▐               ⠂▌',
        '▐               ⠈▌',
        '▐              ⠠ ▌',
        '▐              ⡀ ▌',
        '▐             ⠠  ▌',
        '▐             ⠂  ▌',
        '▐            ⠈   ▌',
        '▐            ⠂   ▌',
        '▐           ⠠    ▌',
        '▐           ⡀    ▌',
        '▐          ⠠     ▌',
        '▐          ⠂     ▌',
        '▐         ⠈      ▌',
        '▐         ⠂      ▌',
        '▐        ⠠       ▌',
        '▐        ⡀       ▌',
        '▐       ⠠        ▌',
        '▐       ⠂        ▌',
        '▐      ⠈         ▌',
        '▐      ⠂         ▌',
        '▐     ⠠          ▌',
        '▐     ⡀          ▌',
        '▐    ⠠           ▌',
        '▐    ⠂           ▌',
        '▐   ⠈            ▌',
        '▐   ⠂            ▌',
        '▐  ⠠             ▌',
        '▐  ⡀             ▌',
        '▐ ⠠              ▌',
        '▐ ⠂              ▌',
        '▐⠈               ▌',
        '▐⠂               ▌',
      ],
    }).start();
  }

  private async writeNewContents(
    newFileContents: Record<string, string>
  ): Promise<void> {
    for (const [filePath, content] of Object.entries(newFileContents)) {
      fs.writeFileSync(filePath, content);
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

  async promptForOpenaiKey(): Promise<string> {
    const { openaiKey } = await this.inquirer.ask<{ openaiKey: string }>(
      'ask-openai-key-questions',
      undefined
    );
    return openaiKey;
  }
}
