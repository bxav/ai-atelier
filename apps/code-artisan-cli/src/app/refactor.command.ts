import * as fs from 'fs';
import * as path from 'path';
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { Command, CommandRunner, InquirerService } from 'nest-commander';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { exec } from 'child_process';

import { loadConfig, loadTextFile } from './utils';

function getChangedFiles(): Promise<string[]> {
  return new Promise((resolve, reject) => {
    exec('git diff --name-only HEAD~1 HEAD', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject(error);
        return;
      }

      if (stderr) {
        console.error(`stderr: ${stderr}`);
        reject(new Error(stderr));
        return;
      }

      // Split the stdout by newline to get an array of file paths
      const filePaths = stdout.split('\n');
      resolve(filePaths);
    });
  });
}

@Command({ name: 'refactor', description: 'Refactor Code' })
export class RefactorCommand extends CommandRunner {
  constructor(private readonly inquirer: InquirerService) {
    super();
  }

  async run(): Promise<void> {
    const prompt = loadConfig(
      path.join(__dirname, 'assets', 'react-expert.md')
    );

    let filePaths = await getChangedFiles();

    filePaths = filePaths.filter((path) => path.endsWith('.tsx'));

    const fileContents: { [key: string]: string } = {};
    for (const path of filePaths) {
      const content = loadTextFile(path);
      fileContents[path] = content;
    }

    const model = new ChatOpenAI({
      modelName: 'gpt-4-1106-preview',
    });

    const template = ChatPromptTemplate.fromTemplate(prompt);

    const outputParser = new StringOutputParser();

    const chain = RunnableSequence.from([template, model, outputParser]);

    const newFileContents = await chain.batch(
      Object.entries(fileContents).map(([path, content]) => ({
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
}
