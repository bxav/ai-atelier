# ContentCrafter

ContentCrafter is an innovative Command Line Interface (CLI) tool designed to transform codebases into captivating narratives and educational resources. By leveraging insights from your code, ContentCrafter facilitates the creation of technical documents, blog posts, video scripts, and presentations, enabling developers to share their knowledge and insights effectively.

## Features

- **Intelligent Content Analysis:** Scans your codebase to identify opportunities for content creation, focusing on areas of complexity, comprehensive documentation, and innovative solutions.
- **Diverse Content Suggestions:** Offers content format suggestions tailored to your code's story, including technical documentation, in-depth blog posts, engaging video scripts, and informative presentations.
- **Customizable Writing Styles:** Configures writing styles for different content types, ensuring consistency in tone, formality, and audience engagement.
- **Content Enhancement:** The `enhance` command rewrites existing content files, improving clarity, engagement, and adherence to specified writing styles.
- **Seamless Integration:** Designed to integrate effortlessly with your existing workflow, requiring minimal setup.

## Installation

Install ContentCrafter globally via npm to use it across your projects:

```bash
npm install -g @bxav/content-crafter
```

## Getting Started

1. **Initialization:** Set up ContentCrafter in your project by running the `init` command. This creates a `.contentcrafter` directory in your project root, containing a `config.yml` for configuration and an `examples` directory.

    ```bash
    content-crafter init
    ```

2. **Configuration:** Customize ContentCrafter to your project's needs by editing the `config.yml` file within the `.contentcrafter` directory, specifying content areas, writing styles, and examples.

3. **Content Analysis:** Use the `analyze` command to identify content creation opportunities within your codebase.

    ```bash
    content-crafter analyze
    ```

4. **Content Enhancement:** Improve existing content for better clarity and engagement with the `enhance` command.

    ```bash
    content-crafter enhance ./path/to/content.md
    ```

## Commands

- **`init`**: Initializes ContentCrafter in your project, setting up necessary configurations.
- **`analyze`**: Analyzes your codebase to suggest content creation opportunities.
- **`enhance`**: Rewrites specified content files to improve quality and align with writing styles.

## Configuring Writing Styles

Define your preferred writing styles for each content type in the `config.yml` file to ensure consistency across your content:

```yaml
contentAreas:
  blogPosts:
    pattern: .md, *.docx
    focus: Engaging Narrative
    writingStyle:
      tone: conversational
      formality: casual
      audience: general public
    templates:
      - path: ./.contentcrafter/templates/blog-post-template.md
```

## Enhancing Content

Use the `enhance` command to refine content, applying improvements for readability, SEO, and adherence to your configured writing styles:

```bash
content-crafter enhance ./content/blog/my-article.md
```

## Contributing

Contributions are welcome! If you're interested in adding features, enhancing functionality, or fixing bugs, please review our contribution guidelines.

## License

ContentCrafter is [MIT licensed](LICENSE).
