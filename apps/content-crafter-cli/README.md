# ContentCrafter

ContentCrafter is an innovative Command Line Interface (CLI) tool designed to bridge the gap between codebases and compelling narratives. It enables developers to convey their technical expertise through engaging stories and educational content, fostering a culture of innovation and learning.

## Key Features

- **Intelligent Content Analysis:** Automatically scans your codebase to identify key areas suitable for narrative-driven content and hands-on tutorials.
- **Customizable Content Generation:** Offers tailored suggestions for various content formats, including technical documentation, blog posts, video scripts, and presentations, crafted to demystify complex concepts.
- **Configurable Voice and Ethos:** Allows for precise customization of the content's tone and ethos, ensuring your narratives resonate with your intended audience while reflecting your unique style.
- **Streamlined Content Creation:** Leverages the `init` and `create` commands to set up your project for content crafting and to produce new content with ease, promoting consistency and engagement.

## Installation

```bash
npm install -g @bxav/content-crafter
```

## Getting Started

### 1. Initialization

Kickstart your content crafting journey by initializing ContentCrafter in your project. This process creates a `.contentcrafter` directory, housing a `config.yml` for your configurations, and sets the stage for your content creation endeavors.

```bash
content-crafter init
```

### 2. Generate New Content

With your project initialized, embark on creating new content using the `create` command. Tailor your content generation process by specifying objectives, selecting content types, and defining output destinations, ensuring your narratives are both engaging and consistent.

```bash
content-crafter create --objective "<your_objective>" <your_code_paths> --type <content_type> -o <output_file>
```

## Configuring Your Project

Customize your `config.yml` to define your content areas, voice, ethos, and preferred AI model. This configuration tailors ContentCrafter to your project's specific needs, enhancing the relevance and impact of your generated content.

## Contributing

Your contributions can help make ContentCrafter even more versatile and user-friendly. Whether it's through adding new features, enhancing existing ones, or fixing bugs, your involvement is invaluable in shaping a tool that serves the wider developer community.

## License

ContentCrafter is proudly [MIT licensed](LICENSE.md), fostering an environment of open collaboration and innovation.
