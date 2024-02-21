import { Command, CommandRunner, InquirerService } from 'nest-commander';
import { promises as fs } from 'fs';
import * as path from 'path';
import axios from 'axios';
import { FileManagerService } from '@bxav/cli-utils';

const BASE_CONTENT_CRAFTER_DIR = '.contentcrafter';
const CONFIG_FILE_NAME = 'config.yml';
const TEMPLATES_DIR_NAME = 'templates';
const EXAMPLES_DIR_NAME = 'examples';
const TEMPLATE_EXAMPLE_URL =
  'https://raw.githubusercontent.com/bxav/ai-atelier/main/apps/content-crafter-cli/examples';

const CONFIG_CONTENT_TEMPLATE = `contentAreas:
  {{contentType}}:
    pattern: {{filePattern}}
    voiceAndEthos: ./${BASE_CONTENT_CRAFTER_DIR}/{{contentType}}/voice-and-ethos.md
#    templates:
#      - path: ./${BASE_CONTENT_CRAFTER_DIR}/{{contentType}}/template.md
#    examples:
#      - path: ./example.md`;

@Command({
  name: 'init',
  description: 'Initialize ContentCrafter in your project',
})
export class InitCommand extends CommandRunner {
  constructor(
    private readonly inquirer: InquirerService,
    private readonly fileManager: FileManagerService
  ) {
    super();
  }

  async run(): Promise<void> {
    const { contentType, contentVoice, contentEthos, contentFilePattern } =
      await this.inquirer.ask<{
        contentType: string;
        contentVoice: string;
        contentEthos: string;
        contentFilePattern: string;
      }>('ask-content-area-questions', undefined);

    console.log('Initializing ContentCrafter for', contentType, '...');

    const contentCrafterDir = path.join(
      process.cwd(),
      BASE_CONTENT_CRAFTER_DIR
    );
    await this.fileManager.ensureDirectory(contentCrafterDir);

    const areaDir = path.join(contentCrafterDir, contentType);
    await this.fileManager.ensureDirectory(areaDir);
    // const templatesDir = path.join(areaDir, TEMPLATES_DIR_NAME);
    // const examplesDir = path.join(areaDir, EXAMPLES_DIR_NAME);
    // await this.fileManager.ensureDirectory(templatesDir);
    // await this.fileManager.ensureDirectory(examplesDir);

    await this.fetchAndSaveFile(
      `${TEMPLATE_EXAMPLE_URL}/${contentType}/voice-and-ethos.md`,
      areaDir,
      'voice-and-ethos.md'
    );

    // await this.fetchAndSaveFile(
    //   `${TEMPLATE_EXAMPLE_URL}/${contentArea}/example.md`,
    //   examplesDir,
    //   'example.md'
    // );

    const configPath = path.join(contentCrafterDir, CONFIG_FILE_NAME);
    const configContent = this.generateConfigContent(
      contentType,
      contentVoice,
      contentEthos,
      contentFilePattern
    );
    await fs.writeFile(configPath, configContent);
    console.log(`Created config.yml for ${contentType} content area setup`);
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
    contentType: string,
    contentVoice: string,
    contentEthos: string,
    contentFilePattern: string
  ): string {
    return CONFIG_CONTENT_TEMPLATE.replace(/{{contentType}}/g, contentType)
      .replace('{{contentVoice}}', contentVoice)
      .replace('{{contentEthos}}', contentEthos)
      .replace('{{filePattern}}', contentFilePattern);
  }
}
