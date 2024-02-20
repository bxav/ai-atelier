import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';

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
}
