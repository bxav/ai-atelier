import { Question, QuestionSet } from 'nest-commander';

const contentFocuses = {
  blog: 'Engaging narratives, industry insights',
  docs: 'Technical documentation, API references',
  tutorials: 'Step-by-step guides, how-to articles',
  caseStudies: 'Real-world applications, success stories',
};

@QuestionSet({ name: 'ask-content-area-questions' })
export class AskContentAreaQuestions {
  @Question({
    message: 'What type of content area would you like to define?',
    name: 'contentType',
    choices: ['docs', 'blog', 'tutorials', 'caseStudies'],
    default: 'docs',
    type: 'list',
  })
  parseContentType(type: string): string {
    return type;
  }

  @Question({
    name: 'contentFocus',
    message: 'Define the focus or theme for this content area',
    default: (v) => {
      return contentFocuses[v.contentType];
    },
  })
  parseContentFocus(focus: string) {
    return focus;
  }

  @Question({
    name: 'contentFilePattern',
    message: 'Specify the file pattern for this content area (e.g., .md for Markdown files)',
    default: '.md',
  })
  parseFilePattern(pattern: string) {
    return pattern;
  }
}
