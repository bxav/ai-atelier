import { promises as fs } from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

import { loadConfig, loadTextFile } from '@bxav/cli-utils';
import { Injectable } from '@nestjs/common';

interface Example {
  path: string;
}

@Injectable()
export class CliConfigService {
  constructor() {}

  async loadConfig(customConfigPath?: string): Promise<any> {
    try {
      const configPath =
        customConfigPath ||
        path.join(process.cwd(), '.codeartisan', 'config.yml');
      const configFile = await fs.readFile(configPath, 'utf8');
      return yaml.load(configFile);
    } catch (error) {
      return null;
    }
  }

  async loadExamples(expertConfig: any): Promise<string[]> {
    if (!expertConfig.examples || expertConfig.examples.length === 0) {
      console.log('No examples configured for this expert.');
      return [];
    }

    const examples = await Promise.all(
      expertConfig.examples.map(async (example: Example) =>
        this.loadFileContent(path.join(process.cwd(), example.path))
      )
    );

    return examples.filter(Boolean);
  }

  async loadCodingStyles(expertConfig: any): Promise<string[]> {
    if (!expertConfig.codingStyles || expertConfig.codingStyles.length === 0) {
      console.log('No coding styles configured for this expert.');
      return [];
    }

    const codingStyles = await Promise.all(
      expertConfig.codingStyles.map(async (stylePath: Example) =>
        this.loadFileContent(path.join(process.cwd(), stylePath.path))
      )
    );

    return codingStyles.filter(Boolean);
  }

  private async loadFileContent(filePath: string): Promise<string | null> {
    try {
      return await fs.readFile(filePath, 'utf8');
    } catch (error) {
      console.error(`File not found: ${filePath}`, error);
      return null;
    }
  }

  loadPrompt() {
    return loadConfig(path.join(__dirname, 'assets', 'expert-prompt.md'));
  }
}
