import { Command, CommandRunner, InquirerService } from 'nest-commander';
import { promises as fs } from 'fs';
import * as path from 'path';
import axios from 'axios';
import { FileManagerService } from '@bxav/cli-utils';

const BASE_CODE_ARTISAN_DIR = '.codeartisan';
const CONFIG_FILE_NAME = 'config.yml';
const CODING_STYLES_FILE_NAME = 'coding-styles.md';
const EXAMPLES_FILE_NAME = 'examples.md';
const EXAMPLES_DIR_NAME = 'examples';
const CODING_STYLES_URL =
  'https://raw.githubusercontent.com/bxav/ai-atelier/main/apps/code-artisan-cli/examples';
const CONFIG_CONTENT_TEMPLATE = `# OpenAI API
model:
  type: OpenAI
  name: gpt-4-1106-preview # gpt-4-1106-preview, ...
  options:
    temperature: 0.5

# # Mistral API
# model:
#   type: Mistral
#   name: mistral-small

# # Local LLM
# model:
#   type: Ollama
#   name: mistral # codellama:13b, ...

commands:
# lint: nx lint
# test: nx test
# build: nx build

experts:
  {{expertType}}:
    pattern: {{expertFilePattern}}
    role: {{expertRole}}
    codingStyles:
      - path: ./${BASE_CODE_ARTISAN_DIR}/{{expertType}}/coding-styles.md
    examples:
      - path: ./${BASE_CODE_ARTISAN_DIR}/{{expertType}}/examples/examples.md`;

@Command({
  name: 'init',
  description: 'Initialize CodeArtisan in your project',
})
export class InitCommand extends CommandRunner {
  constructor(
    private readonly inquirer: InquirerService,
    private readonly fileManager: FileManagerService
  ) {
    super();
  }
  async run(): Promise<void> {
    const { expertType, expertRole, expertFilePattern } =
      await this.inquirer.ask<{
        expertType: string;
        expertRole: string;
        expertFilePattern: string;
      }>('ask-build-expert-questions', undefined);

    console.log('Initializing CodeArtisan for', expertType, '...');

    const codeArtisanDir = path.join(process.cwd(), BASE_CODE_ARTISAN_DIR);
    await this.fileManager.ensureDirectory(codeArtisanDir);

    const expertDir = path.join(codeArtisanDir, expertType);
    const examplesDir = path.join(expertDir, EXAMPLES_DIR_NAME);
    await this.fileManager.ensureDirectory(examplesDir);

    await this.fetchAndSaveFile(
      `${CODING_STYLES_URL}/${expertType}/${CODING_STYLES_FILE_NAME}`,
      expertDir,
      CODING_STYLES_FILE_NAME
    );

    await this.fetchAndSaveFile(
      `${CODING_STYLES_URL}/${expertType}/${EXAMPLES_FILE_NAME}`,
      examplesDir,
      EXAMPLES_FILE_NAME
    );

    const configPath = path.join(codeArtisanDir, CONFIG_FILE_NAME);
    const configContent = this.generateConfigContent(
      expertType,
      expertRole,
      expertFilePattern
    );
    await fs.writeFile(configPath, configContent);
    console.log('Created config.yml with React expert setup');
  }

  private async fetchAndSaveFile(
    url: string,
    directory: string,
    filename: string
  ): Promise<void> {
    try {
      const response = await axios.get(url);
      const filePath = path.join(directory, filename);
      await this.fileManager.writeFile(filePath, response.data);
      console.log(`Fetched and saved ${filename}`);
    } catch (error) {
      console.error(`Failed to fetch and save ${filename}:`, error);
    }
  }

  private generateConfigContent(
    expertType: string,
    expertRole: string,
    expertFilePattern: string
  ): string {
    return CONFIG_CONTENT_TEMPLATE.replace(/{{expertType}}/g, expertType)
      .replace('{{expertFilePattern}}', expertFilePattern)
      .replace('{{expertRole}}', expertRole);
  }
}
