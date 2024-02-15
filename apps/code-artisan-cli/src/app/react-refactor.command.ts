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

import { getChangedFiles, loadConfig, loadTextFile } from '@bxav/cli-utils';

@Command({ name: 'react-refactor', description: 'Refactor React Code' })
export class ReactRefactorCommand extends CommandRunner {
  constructor(private readonly inquirer: InquirerService) {
    super();
  }

  async run(
    _params: string[],
    options: {
      commitDiff: string;
      codingStyles: string;
      examples: string;
    }
  ): Promise<void> {
    let prompt = loadConfig(path.join(__dirname, 'assets', 'react-expert.md'));
    let codingStyles = loadConfig(
      options.codingStyles ??
        path.join(__dirname, 'assets', 'react-coding-styles.md')
    );

    let examples = loadConfig(
      options.examples ?? path.join(__dirname, 'assets', 'react-examples.md')
    );

    let filePaths = _params;

    if (!filePaths.length) {
      filePaths = await getChangedFiles(options.commitDiff || undefined);
    }

    filePaths = filePaths.filter((path) => path.endsWith('.tsx'));

    const fileContents: { [key: string]: string } = {};

    for (const path of filePaths) {
      const content = loadTextFile(path);
      fileContents[path] = content;
    }

    const model = new ChatOpenAI({
      modelName: 'gpt-4-1106-preview',
      openAIApiKey:
        process.env.OPENAI_API_KEY || (await this.promptForOpenaiKey()),
    });

    const template = ChatPromptTemplate.fromTemplate(prompt);

    const outputParser = new StringOutputParser();

    const chain = RunnableSequence.from([template, model, outputParser]);

    const newFileContents = await chain.batch(
      Object.entries(fileContents).map(([path, content]) => ({
        codingStyles,
        examples,
        input: `Refactor the following component:
    \`\`\`tsx
    ${content}
    \`\`\`

    Do not add any breaking changes. Do not add any comment to the component. Respond directly with the component without markdown around it.
    `,
      }))
    );

    const newFileContentsDict = Object.entries(fileContents).reduce(
      (acc, [path], index) => {
        acc[path] = newFileContents[index];
        return acc;
      },
      {}
    );

    for (const [path, content] of Object.entries(newFileContentsDict)) {
      await fs.writeFileSync(path, content as string);
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
    flags: '-s, --coding-styles [codingStyles]',
    description: 'The coding styles to use for the refactor',
  })
  parseCodingStylePath(val: string) {
    return val;
  }

  @Option({
    flags: '-e, --examples [examplesPath]',
    description: 'The examples to use for the refactor',
  })
  parseExamples(val: string) {
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
