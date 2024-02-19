# CodeArtisan

CodeArtisan is a cutting-edge Command Line Interface (CLI) tool designed to leverage Large Language Models (LLMs) for enhancing code quality across various programming languages. It offers intelligent, context-aware auto-fixing of linting issues and refactoring suggestions, ensuring your codebase adheres to the latest best practices and standards.

## Installation

Install CodeArtisan globally using npm to start improving your codebase:

```bash
npm install -g @bxav/code-artisan
```

## Initialization

Run the `init` command to set up CodeArtisan in your project. This creates a `.codeartisan` directory in your project root, containing a `config.yml` for configuration and an `examples` directory for custom setups:

```bash
code-artisan init
```

Your project structure will then include:

```
ProjectRoot/
└── .codeartisan/
    ├── config.yml
    └── examples/
```

### Configuring CodeArtisan

Edit the `config.yml` file within the `.codeartisan` directory to suit your project's needs:

```yml
experts:
  react:
    pattern: .tsx, *.jsx
    role: Senior React Developer
    codingStyles:
      - path: ./.codeartisan/react-coding-styles.md
    examples:
      - path: ./.codeartisan/examples/reactExample1.tsx
      - path: ./.codeartisan/examples/reactExample2.tsx
  nestjs:
    pattern: .service.ts, .module.ts, .controller.ts
    role: Senior Nodejs Developer, expert in NestJS
    codingStyles:
      - path: ./.codeartisan/nestjs-coding-styles.md
      - path: ./.codeartisan/nodejs-coding-styles.md
    examples:
      - path: ./.codeartisan/examples/example1.controller.ts
      - path: ./.codeartisan/examples/example1.service.ts
      - path: ./.codeartisan/examples/example1.module.ts
```

## Usage

### Smart corrector (Auto-Fixing Linter)

`smart-corrector` is a command within CodeArtisan aimed at automatically resolving linting issues in your code. It uses the expert roles, coding styles, and examples you've defined to tailor its fixes to your project's specifications.

#### Basic Command

Automatically fix linting issues throughout your project with:

```bash
code-artisan smart-corrector
```

This scans all relevant files in the current directory, defaulting to Git to identify changed files if no commit diff is specified.

#### Targeting Specific Files or Folders

Specify files or folders for linting fixes:

- For individual files:

  ```bash
  code-artisan smart-corrector path/to/your/file.tsx another/path/to/file.tsx
  ```

- For folders:

  ```bash
  code-artisan smart-corrector path/to/your/folder/
  ```

#### Command Options

The `smart-corrector` supports several options to customize its operation, including `--commit-diff` for Git commit diffs, `--expert` for expert-specific suggestions, and `--config` to specify an alternative configuration file:

```bash
code-artisan smart-corrector --commit-diff HEAD~1..HEAD
code-artisan smart-corrector --expert react
code-artisan smart-corrector --config path/to/your/config.yml
```

#### Advanced Usage

Combine multiple options for a comprehensive linting process, including the `--config` parameter to use a custom configuration file:

```bash
code-artisan smart-corrector path/to/your/file.tsx --expert react --config path/to/your/config.yml
```

### Environment Variables

Set the `OPENAI_API_KEY` environment variable with your OpenAI API key to enable CodeArtisan's functionality.
