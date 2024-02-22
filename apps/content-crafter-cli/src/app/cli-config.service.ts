import { promises as fs } from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

import { Injectable } from '@nestjs/common';

@Injectable()
export class CliConfigService {
  constructor() {}

  async loadConfig(customConfigPath?: string): Promise<any> {
    try {
      const configPath =
        customConfigPath ||
        path.join(process.cwd(), '.contentcrafter', 'config.yml');
      const configFile = await fs.readFile(configPath, 'utf8');
      return yaml.load(configFile);
    } catch (error) {
      return null;
    }
  }
}
