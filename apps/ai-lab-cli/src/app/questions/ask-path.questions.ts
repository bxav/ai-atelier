import { Question, QuestionSet } from "nest-commander";

@QuestionSet({ name: 'ask-path-questions' })
export class AskPathQuestions {
  @Question({
    message: 'What is the path to your config file?',
    name: 'path',
  })
  parsePath(val: string) {
    return val;
  }
}