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

The `config.yml` file within the `.codeartisan` directory has been enhanced to suit your project's needs. You can specify the model type, name, and options such as temperature for the model's responses. This allows for a more tailored and precise code refactoring and linting experience.

```yml
# OpenAI API
model:
  type: OpenAI
  name: gpt-4-1106-preview # Example: gpt-4-1106-preview, ...
  options:
    temperature: 0.5

# Uncomment to use Mistral API
# model:
#   type: Mistral
#   name: mistral-small

# Uncomment to use a Local LLM
# model:
#   type: Ollama
#   name: codellama # Example: codellama:13b, ...

experts:
  react:
    pattern: .tsx, .jsx
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

### Smart Corrector (Auto-Fixing Linter)

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

To fully enable CodeArtisan's functionality with Large Language Models, you need to set specific environment variables:

- For using **OpenAI models**, set the `OPENAI_API_KEY` environment variable with your OpenAI API key.
- For using **Ollama models**, set the `OLLAMA_BASE_URL` environment variable to specify the base URL of your Ollama service. This is crucial for the CLI to communicate with your local or hosted Ollama instance.

Example of setting environment variables:

```bash
export OPENAI_API_KEY='your_openai_api_key_here'
export OLLAMA_BASE_URL='http://localhost:11434' # Or the URL of your hosted Ollama service
```

Ensure these variables are correctly set in your environment to leverage the respective models' capabilities within CodeArtisan for code refactoring and linting.
