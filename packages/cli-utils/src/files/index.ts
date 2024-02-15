import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

export function loadYaml(filePath: string): any {
  try {
    const fileContent = yaml.load(fs.readFileSync(filePath, 'utf8'));
    return fileContent;
  } catch (error) {
    console.error('Error reading or parsing YAML file:', error);
  }
}

export function loadJSON(filePath: string): any {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);
    return data;
  } catch (error) {
    console.error('Error reading or parsing JSON file:', error);
  }
}

export function loadMarkdown(filePath: string): string {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return fileContent;
  } catch (error) {
    console.error('Error reading or parsing Markdown file:', error);
  }
}

export function loadTextFile(filePath: string): string {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return fileContent;
  } catch (error) {
    console.error('Error reading or parsing Markdown file:', error);
  }
}

export function loadConfig(filePath: string): any {
  const ext = path.extname(filePath);

  switch (ext.toLowerCase()) {
    case '.yaml':
    case '.yml':
      return loadYaml(filePath);
    case '.json':
      return loadJSON(filePath);
    case '.md':
      return loadMarkdown(filePath);
    default:
      console.error('Unsupported file format:', ext);
  }
}
