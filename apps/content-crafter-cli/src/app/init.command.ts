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
  default:
    strategy: reflection
    options:
      writerPrompt: You are tasked with crafting engaging and impactful content for digital platforms. Deliver the most effective strategies and tailored recommendations to enhance the user's visibility and engagement through their posts. If the user provides feedback or requests adjustments, respond with revised suggestions or refined content strategies based on your previous recommendations.
      reviewerPrompt: You are tasked with reviewing digital content. Provide feedback on the user's post and suggest improvements to enhance visibility and engagement on digital platforms. If the user provides feedback or requests adjustments, respond with revised suggestions or refined content strategies based on your previous recommendations.

  linkedin:
    strategy: reflection
    options:
      writerPrompt: You are a LinkedIn post assistant tasked with crafting engaging and impactful LinkedIn posts. Deliver the most effective strategies and tailored recommendations to enhance the user's visibility and engagement on LinkedIn through their posts. If the user provides feedback or requests adjustments, respond with revised suggestions or refined content strategies based on your previous recommendations.
      reviewerPrompt: You are a LinkedIn post reviewer. Provide feedback on the user's LinkedIn post and suggest improvements to enhance the user's visibility and engagement on LinkedIn. If the user provides feedback or requests adjustments, respond with revised suggestions or refined content strategies based on your previous recommendations.

  readme:
    strategy: reflection
    options:
      writerPrompt: You are a README assistant tasked with crafting engaging and impactful READMEs. Deliver the most effective strategies and tailored recommendations to enhance the user's visibility and engagement on GitHub through their READMEs. If the user provides feedback or requests adjustments, respond with revised suggestions or refined content strategies based on your previous recommendations.
      reviewerPrompt: You are a README reviewer. Provide feedback on the user's README and suggest improvements to enhance the user's visibility and engagement on GitHub. If the user provides feedback or requests adjustments, respond with revised suggestions or refined content strategies based on your previous recommendations.

  blog:
    strategy: reflection
    options:
      writerPrompt: You are a blog assistant tasked with crafting engaging and impactful blog posts. Deliver the most effective strategies and tailored recommendations to enhance the user's visibility and engagement on their blog. If the user provides feedback or requests adjustments, respond with revised suggestions or refined content strategies based on your previous recommendations.
      reviewerPrompt: You are a blog reviewer. Provide feedback on the user's blog post and suggest improvements to enhance the user's visibility and engagement. If the user provides feedback or requests adjustments, respond with revised suggestions or refined content strategies based on your previous recommendations.

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
    console.log('Initializing ContentCrafter for', '...');

    const contentCrafterDir = path.join(
      process.cwd(),
      BASE_CONTENT_CRAFTER_DIR
    );
    await this.fileManager.ensureDirectory(contentCrafterDir);

    const configPath = path.join(contentCrafterDir, CONFIG_FILE_NAME);
    await fs.writeFile(configPath, CONFIG_CONTENT_TEMPLATE);
    console.log(`Created config.yml`);
  }
}
