import { Command, CommandRunner, InquirerService } from 'nest-commander';
import { promises as fs } from 'fs';
import * as path from 'path';
import { FileManagerService } from '@bxav/cli-utils';

const BASE_CONTENT_CRAFTER_DIR = '.contentcrafter';
const CONFIG_FILE_NAME = 'config.yml';

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

contentAreas:
  {{contentType}}:
    strategy: reflection
    options:
      writerPrompt: You are tasked with crafting engaging and impactful content for digital platforms. Deliver the most effective strategies and tailored recommendations to enhance the user's visibility and engagement through their posts. If the user provides feedback or requests adjustments, respond with revised suggestions or refined content strategies based on your previous recommendations.
      reviewerPrompt: You are tasked with reviewing digital content. Provide feedback on the user's post and suggest improvements to enhance visibility and engagement on digital platforms. If the user provides feedback or requests adjustments, respond with revised suggestions or refined content strategies based on your previous recommendations.

`;

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
    const { contentType } = await this.inquirer.ask<{
      contentType: string;
    }>('ask-content-area-questions', undefined);

    console.log('Initializing ContentCrafter for', contentType, '...');

    const contentCrafterDir = path.join(
      process.cwd(),
      BASE_CONTENT_CRAFTER_DIR
    );
    await this.fileManager.ensureDirectory(contentCrafterDir);

    const configPath = path.join(contentCrafterDir, CONFIG_FILE_NAME);
    const configContent = this.generateConfigContent(contentType);
    await fs.writeFile(configPath, configContent);
    console.log(`Created config.yml for ${contentType} content area setup`);
  }

  private generateConfigContent(contentType: string): string {
    return CONFIG_CONTENT_TEMPLATE.replace(/{{contentType}}/g, contentType);
  }
}
