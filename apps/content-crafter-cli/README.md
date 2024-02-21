# ContentCrafter

ContentCrafter is a pioneering Command Line Interface (CLI) tool designed to transform codebases into engaging narratives and educational resources. It empowers developers to articulate their expertise with clarity, igniting the spark of innovation in their audience.

## Features

- **Intelligent Content Analysis:** Scans your codebase to pinpoint opportunities for content creation, emphasizing areas ripe for storytelling and practical tutorials.
- **Diverse Content Suggestions:** Provides suggestions for content formats such as technical documentation, in-depth blog posts, engaging video scripts, and informative presentations, tailored to convey complex concepts with simplicity.
- **Customizable Voice and Ethos:** Enables fine-tuning of content's voice and ethos settings, ensuring alignment with a style of clear, concise, and innovative communication.
- **Content Enhancement:** Utilizes the `enhance` command to refine existing content, enhancing clarity, engagement, and adherence to the configured voice and ethos.
- **Templates and Examples Configuration:** Offers the ability to configure templates and examples for various content types, facilitating consistency and ease in content creation.

## Installation

Install ContentCrafter globally via npm to bring an insightful approach to your projects:

```bash
npm install -g @bxav/content-crafter
```

## Getting Started

1. **Initialization:** Begin your journey with ContentCrafter by initializing it in your project. This sets up a `.contentcrafter` directory with a `config.yml` for configurations and directories for templates and examples.

   ```bash
   content-crafter init
   ```

2. **Configuration:** Tailor ContentCrafter to your project's needs by editing the `config.yml`. Define content areas, voice, ethos, and paths to templates and examples that reflect a unique approach.

3. **Content Analysis:** Discover areas where a mix of storytelling and hands-on tutorials can illuminate your codebase with the `analyze` command.

   ```bash
   content-crafter analyze
   ```

4. **Content Creation:** Start creating new content using the predefined templates, ensuring consistency and ease of creation.

   ```bash
   content-crafter create readme "My New Blog Post"
   ```

5. **Content Enhancement:** Elevate your existing content with the `enhance` command, making it resonate with a style of making complex concepts accessible.

   ```bash
   content-crafter enhance ./path/to/content.md
   ```

## Configuring Content Areas

Define content areas in the `config.yml` file, specifying patterns, voice, ethos, and paths to templates and examples:

```yaml
contentAreas:
  readme:
    pattern: '.md, .mdx'    
    voiceAndEthos: ./.contentcrafter/readme/voice-and-ethos.md
    # templates:
    #   - path: ./templates/readme-template.md
    # examples:
    #   - path: ./examples/blog-post-example.md
```

## Contributing

Contributions to ContentCrafter are welcome! Whether it's adding new features, enhancing functionality, or fixing bugs, your input helps foster a community of developers passionate about sharing knowledge in an engaging, accessible manner.

## License

ContentCrafter is [MIT licensed](LICENSE.md), promoting open collaboration and innovation.
