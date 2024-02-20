import * as fs from 'fs';
import * as path from 'path';
import { Command, CommandRunner, Option } from 'nest-commander';
import * as yaml from 'js-yaml';

const loading = require('loading-cli');

function getFilesRecursively(directory: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(directory);
  list.forEach((file) => {
    file = path.resolve(directory, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(file));
    } else {
      results.push(file);
    }
  });
  return results;
}
@Command({
  name: 'analyze',
  description: 'Analyze codebase for content opportunities',
})
export class AnalyzeCommand extends CommandRunner {
  async run(params: string[], options: { config: string }): Promise<void> {
    const config = this.loadConfig(options.config);
    if (!config) {
      console.error('Failed to load configuration.');
      return;
    }

    const contentAreas = config.contentAreas;
    if (!contentAreas) {
      console.error('No content areas configured.');
      return;
    }

    console.log('Analyzing codebase for content opportunities...');

    const projectRoot = process.cwd();
    const files = getFilesRecursively(projectRoot);

    const analysisResults = this.analyzeFiles(files, contentAreas);

    this.displayResults(analysisResults);
  }

  private loadConfig(customConfigPath?: string): any {
    try {
      const configPath =
        customConfigPath ||
        path.join(process.cwd(), '.contentcrafter', 'config.yml');
      const configFile = fs.readFileSync(configPath, 'utf8');
      return yaml.load(configFile);
    } catch (error) {
      console.error('Error loading config file:', error);
      return null;
    }
  }

  private analyzeFiles(files: string[], contentAreas: any): any[] {
    let analysisResults: any[] = [];
    files.forEach((file) => {
      const fileContent = fs.readFileSync(file, 'utf8');
      Object.entries(contentAreas).forEach(([areaKey, areaValue]) => {
        const { pattern, focus } = areaValue as any;
        if (new RegExp(pattern).test(file)) {
          // Perform analysis based on the focus area and file content
          // Placeholder for actual content analysis logic
          const result = {
            file,
            area: areaKey,
            suggestions: [`Consider a ${focus} article based on this file.`],
          };
          analysisResults.push(result);
        }
      });
    });

    return analysisResults;
  }

  private displayResults(results: any[]): void {
    if (results.length === 0) {
      console.log('No significant content opportunities identified.');
      return;
    }

    console.log('Content opportunities identified:');
    results.forEach((result) => {
      console.log(`- File: ${result.file}`);
      console.log(`  Area: ${result.area}`);
      result.suggestions.forEach((suggestion: string) => {
        console.log(`  Suggestion: ${suggestion}`);
      });
    });
  }

  @Option({
    flags: '--config [path]',
    description: 'Path to a custom ContentCrafter configuration file',
  })
  parseConfig(val: string) {
    return val;
  }
}
