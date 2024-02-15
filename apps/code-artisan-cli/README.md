# CodeArtisan

CodeArtisan is an innovative Command Line Interface (CLI) tool designed to enhance code quality across various programming languages using the power of Large Language Models (LLMs). By integrating cutting-edge AI, CodeArtisan offers smart, context-aware refactoring suggestions, making your codebase cleaner, more efficient, and aligned with the latest best practices.

## Installation

To begin using CodeArtisan in your projects, install the tool globally via npm:

```bash
npm install -g @bxav/code-artisan
```

## Usage

`CodeArtisan` currently features the `react-refactor` command, designed to intelligently refactor React code with the assistance of AI. This command analyzes `.tsx` files, offering suggestions to improve code quality without adding breaking changes or comments.

### Basic Command

Run the following command in your project directory to refactor `.tsx` files using `CodeArtisan`:

```bash
code-artisan react-refactor
```

This will analyze all `.tsx` files in the current directory. If a commit diff is not specified, the command will attempt to identify changed `.tsx` files using Git.

### Refactoring Specific Files

You can also specify one or more `.tsx` files to refactor directly in the command:

```bash
code-artisan react-refactor path/to/your/file.tsx another/path/to/file.tsx
```

### Command Options

The `react-refactor` command provides several options for customization:

- `-c, --commit-diff [commitDiff]`: Use a Git commit diff to limit refactoring to files changed between specified commits. Ideal for CI/CD integration or focusing on recent changes.

  ```bash
  code-artisan react-refactor --commit-diff HEAD~1..HEAD
  ```

- `-s, --coding-styles [codingStyles]`: Path to a file with coding style guidelines. This option allows `CodeArtisan` to align refactoring suggestions with your project's coding standards.

  ```bash
  code-artisan react-refactor --coding-styles path/to/coding-styles.md
  ```

- `-e, --examples [examplesPath]`: Path to a file containing example code snippets. These examples help the AI understand the context and desired output format for refactorings.

  ```bash
  code-artisan react-refactor --examples path/to/examples.md
  ```

### Advanced Usage

Combine multiple options to fine-tune the refactoring process to your project's unique requirements. For instance:

```bash
code-artisan react-refactor path/to/your/file.tsx --coding-styles path/to/coding-styles.md --examples path/to/examples.md
```

### Environment Variables

Ensure the `OPENAI_API_KEY` environment variable is set with your OpenAI API key. If not set, the CLI will prompt you to enter it when required.
