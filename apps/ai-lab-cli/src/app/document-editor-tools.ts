import * as fs from 'fs';
import * as path from 'path';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';

const WORKING_DIRECTORY = './_output';

function loadTextFile(filePath: string): string {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return fileContent;
  } catch (error) {
    console.error('Error reading or parsing Markdown file:', error);
  }
}

function saveToFile(fileName: string, content: string): void {
  if (!fs.existsSync(WORKING_DIRECTORY)) {
    fs.mkdirSync(WORKING_DIRECTORY, { recursive: true });
  }

  console.log('Saving to:', path.join(WORKING_DIRECTORY, fileName), content);
  fs.writeFileSync(path.join(WORKING_DIRECTORY, fileName), content);
}

const readDocumentTool = new DynamicStructuredTool({
  name: 'read_document',
  description: 'Read the specified document.',
  schema: z.object({
    file_name: z.string(),
    start: z.number().optional(),
    end: z.number().optional(),
  }),
  func: async ({ file_name, start, end }) => {
    const filePath = `${WORKING_DIRECTORY}/${file_name}`;
    const data = loadTextFile(filePath);
    const lines = data.split('\n');
    return lines.slice(start ?? 0, end).join('\n');
  },
});

const writeDocumentTool = new DynamicStructuredTool({
  name: 'write_document',
  description: 'Create and save a markdown document.',
  schema: z.object({
    content: z.string(),
    file_name: z.string(),
  }),
  func: async ({ content, file_name }) => {
    await saveToFile(`${file_name}.md`, content);
    return `Document saved to ${file_name}`;
  },
});

const editDocumentTool = new DynamicStructuredTool({
  name: 'edit_document',
  description: 'Edit a document by inserting text at specific line numbers.',
  schema: z.object({
    file_name: z.string(),
    inserts: z.record(z.number(), z.string()),
  }),
  func: async ({ file_name, inserts }) => {
    const filePath = `${WORKING_DIRECTORY}/${file_name}`;
    const data = await loadTextFile(filePath);
    const lines = data.split('\n');

    const sortedInserts = Object.entries(inserts).sort(
      ([a], [b]) => parseInt(a) - parseInt(b)
    );

    for (const [line_number_str, text] of sortedInserts) {
      const line_number = parseInt(line_number_str);
      if (1 <= line_number && line_number <= lines.length + 1) {
        lines.splice(line_number - 1, 0, text);
      } else {
        return `Error: Line number ${line_number} is out of range.`;
      }
    }

    await saveToFile(filePath, lines.join('\n'));
    return `Document edited and saved to ${file_name}`;
  },
});

export { readDocumentTool, writeDocumentTool, editDocumentTool };
