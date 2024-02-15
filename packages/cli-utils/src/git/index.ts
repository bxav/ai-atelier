import { exec } from 'child_process';

export function getChangedFiles(
  ref: string = 'HEAD~1 HEAD'
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    exec(`git diff --name-only ${ref}`, (error, stdout, stderr) => {
      if (error) {
        if (error.message.includes('not a git repository')) {
          console.error('Git is not initialized in this directory.');
          reject(new Error('Git is not initialized in this directory.'));
        } else {
          console.error(`exec error: ${error}`);
          reject(error);
        }
        return;
      }

      if (stderr) {
        console.error(`stderr: ${stderr}`);
        reject(new Error(stderr));
        return;
      }

      // Split the stdout by newline to get an array of file paths
      const filePaths = stdout.split('\n');
      resolve(filePaths);
    });
  });
}
