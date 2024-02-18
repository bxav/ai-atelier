import { Question, QuestionSet } from 'nest-commander';

const filePatterns = {
  next: '.tsx, .jsx',
  nestjs: '.ts',
  'c++': '.c, .cpp',
  python: '.py',
};

@QuestionSet({ name: 'ask-build-expert-questions' })
export class AskBuildExpertQuestions {
  @Question({
    message:
      'What example would you like to load? You can update this later in the .codeartisan/config.yml file.',
    name: 'expertType',
    choices: ['next', 'nestjs', 'c++', 'python'],
    default: 'next',
    type: 'list',
  })
  parseExpertType(type: string): string {
    return type;
  }

  @Question({
    name: 'expertRole',
    message: 'Give a role to your expert',
    default: (v) => {
      return `Senior ${
        v.expertType.charAt(0).toUpperCase() + v.expertType.slice(1)
      } Engineer`;
    },
  })
  parseExpertRole(role: string) {
    return role;
  }

  @Question({
    name: 'expertFilePattern',
    message: 'Give a file pattern to your expert',
    default: (v) => {
      return filePatterns[v.expertType];
    },
  })
  parseFilePattern(pattern: string) {
    return pattern;
  }
}
