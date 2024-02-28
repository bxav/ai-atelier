import { promises as fs } from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

import { loadConfig, loadTextFile } from '@bxav/cli-utils';
import { Injectable } from '@nestjs/common';
import { z } from 'zod';

const modelSchema = z.object({
  type: z.string(),
  name: z.string(),
  options: z
    .object({
      temperature: z.number(),
    })
    .optional(),
});

const optionsSchema = z.object({
  writerPrompt: z.string(),
  reviewerPrompt: z.string(),
});

const contentAreaSchema = z.object({
  strategy: z.enum(['reflection', 'basic']),
  options: optionsSchema,
});

const contentAreasSchema = z.record(contentAreaSchema);

const mainSchema = z.object({
  model: modelSchema.optional(),
  contentAreas: contentAreasSchema,
});

type CliConfig = z.infer<typeof mainSchema>;

@Injectable()
export class CliConfigService {
  constructor() {}

  validate(parsedYaml: unknown): parsedYaml is CliConfig {
    const result = mainSchema.safeParse(parsedYaml);

    if (result.success === false && result.error instanceof z.ZodError) {
      console.error('YAML validation failed with the following errors:');
      result.error.errors.forEach((err) => {
        console.log(`Path: ${err.path.join('.')}, Message: ${err.message}`);
      });
    }

    return result.success;
  }

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

  loadPrompt() {
    return loadConfig(path.join(__dirname, 'assets', 'expert-prompt.md'));
  }
}
