# {{ CLI_NAME }}

{{ CLI_DESCRIPTION }}

## Installation

Install {{ CLI_NAME }} globally using npm to start improving your codebase:

```bash
npm install -g {{ NPM_PACKAGE_NAME }}
```

## Initialization

Run the `init` command to set up {{ CLI_NAME }} in your project. This creates a `{{ CONFIG_DIRECTORY_NAME }}` directory in your project root, containing a `config.yml` for configuration and an `examples` directory for custom setups:

```bash
{{ CLI_COMMAND_PREFIX }} init
```

Your project structure will then include:

```
ProjectRoot/
└── {{ CONFIG_DIRECTORY_NAME }}/
    ├── config.yml
    └── examples/
```

### Configuring {{ CLI_NAME }}

Edit the `config.yml` file within the `{{ CONFIG_DIRECTORY_NAME }}` directory to suit your project's needs:

```yml
{{ CONFIG_CONTENTS }}
```

## Usage

### {{ FEATURE_NAME }}

`{{ FEATURE_COMMAND }}` is a command within {{ CLI_NAME }} aimed at {{ FEATURE_DESCRIPTION }}.

#### Basic Command

{{ BASIC_COMMAND_DESCRIPTION }}

```bash
{{ CLI_COMMAND_PREFIX }} {{ FEATURE_COMMAND }}
```

{{ ADDITIONAL_COMMAND_INFO }}

#### Targeting Specific Files or Folders

{{ TARGETING_DESCRIPTION }}

- For individual files:

  ```bash
  {{ CLI_COMMAND_PREFIX }} {{ FEATURE_COMMAND }} path/to/your/file
  ```

- For folders:

  ```bash
  {{ CLI_COMMAND_PREFIX }} {{ FEATURE_COMMAND }} path/to/your/folder/
  ```

#### Command Options

{{ COMMAND_OPTIONS_DESCRIPTION }}

```bash
{{ CLI_COMMAND_PREFIX }} {{ FEATURE_COMMAND }} --option
```

#### Advanced Usage

{{ ADVANCED_USAGE_DESCRIPTION }}

```bash
{{ CLI_COMMAND_PREFIX }} {{ FEATURE_COMMAND }} --option
```

### Environment Variables

{{ ENVIRONMENT_VARIABLES_DESCRIPTION }}
```

In this template:

- `{{ CLI_NAME }}`, `{{ CLI_DESCRIPTION }}`, `{{ NPM_PACKAGE_NAME }}`, etc., are placeholders that should be replaced with specific information relevant to the CLI being documented.
- Sections like `{{ CONFIG_CONTENTS }}` should be filled with example configuration details or further instructions specific to the CLI's functionality.
- `{{ FEATURE_NAME }}`, `{{ FEATURE_DESCRIPTION }}`, `{{ BASIC_COMMAND_DESCRIPTION }}`, etc., are placeholders for describing specific features or commands offered by the CLI.
