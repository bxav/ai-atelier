import { Injectable } from '@nestjs/common';
import { promises as fs, statSync } from 'fs';
import * as path from 'path';

@Injectable()
export class FileManagerService {
  async ensureDirectory(path: string): Promise<void> {
    try {
      await fs.access(path);
    } catch {
      await fs.mkdir(path, { recursive: true });
      console.log(`Directory created at ${path}`);
    }
  }

  async writeFile(path: string, content: string): Promise<void> {
    await fs.writeFile(path, content);
  }

  async getFilesRecursively(directory: string): Promise<string[]> {
    const files: string[] = await fs.readdir(directory);

    const results: Promise<string[]>[] = files.map(
      async (file: string): Promise<string[]> => {
        const filePath: string = path.join(directory, file);
        const stat = statSync(filePath);

        if (stat.isDirectory()) {
          return this.getFilesRecursively(filePath);
        } else {
          return [filePath];
        }
      }
    );

    return (await Promise.all(results)).flat();
  }
}
