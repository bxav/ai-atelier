import { Command, CommandRunner, InquirerService } from 'nest-commander';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

@Command({
  name: 'init',
  description: 'Initialize CodeArtisan in your project',
})
export class InitCommand extends CommandRunner {
  constructor(private readonly inquirer: InquirerService) {
    super();
  }
  async run(): Promise<void> {
    const { expertType } = await this.inquirer.ask<{ expertType: string }>(
      'ask-build-expert-questions',
      undefined
    );

    console.log('Initializing CodeArtisan for', expertType, '...');

    // Create .codeartisan directory
    const codeArtisanDir = path.join(process.cwd(), '.codeartisan');
    this.ensureDirectory(codeArtisanDir, 'Created .codeartisan directory');

    const exertDir = path.join(codeArtisanDir, expertType);
    const examplesDir = path.join(exertDir, 'examples');
    this.ensureDirectory(examplesDir, 'Created examples directory');

    const codingStylesUrl = `https://raw.githubusercontent.com/bxav/ai-atelier/main/apps/code-artisan-cli/src/assets/${expertType}/coding-styles.md`;
    await this.fetchAndSaveFile(
      codingStylesUrl,
      exertDir,
      'coding-styles.md',
      'Coding styles'
    );

    const exampleUrl = `https://raw.githubusercontent.com/bxav/ai-atelier/main/apps/code-artisan-cli/src/assets/${expertType}/examples.md`;
    await this.fetchAndSaveFile(
      exampleUrl,
      exertDir,
      'examples.md',
      'examples'
    );

    // Create config.yml with React expert setup
    const configPath = path.join(codeArtisanDir, 'config.yml');
    const configContent = this.generateConfigContent();
    fs.writeFileSync(configPath, configContent);
    console.log('Created config.yml with React expert setup');
  }

  private ensureDirectory(directoryPath: string, successMessage: string): void {
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
      console.log(successMessage);
    }
  }

  private async fetchAndSaveFile(
    url: string,
    directory: string,
    filename: string,
    fileTypeDescription: string
  ): Promise<void> {
    try {
      const response = await axios.get(url);
      const filePath = path.join(directory, filename);
      fs.writeFileSync(filePath, response.data);
      console.log(`Fetched and saved ${fileTypeDescription}`);
    } catch (error) {
      console.error(`Failed to fetch ${fileTypeDescription}:`, error);
    }
  }

  private generateConfigContent(): string {
    return `commands:
# lint: nx lint
# test: nx test
# build: nx build

experts:
  react:
    pattern: (*.tsx|*.jsx)
    role: Senior React Developer
    codingStyles:
      - path: ./.codeartisan/react-coding-styles.md
    examples:
      - path: ./.codeartisan/examples/reactExample1.md`;
  }
}
