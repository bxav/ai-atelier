import { Question, QuestionSet } from 'nest-commander';

@QuestionSet({ name: 'ask-content-area-questions' })
export class AskContentAreaQuestions {
  @Question({
    message: 'What type of content area would you like to define?',
    name: 'contentType',
    choices: ['docs', 'blog'],
    default: 'docs',
    type: 'list',
  })
  parseContentType(type: string): string {
    return type;
  }
}
