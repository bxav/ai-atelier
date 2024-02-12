import { Question, QuestionSet } from "nest-commander";

@QuestionSet({ name: 'ask-objective-questions' })
export class AskObjectiveQuestions {
  @Question({
    message: 'What is your objective?',
    name: 'objective',
  })
  parseObjective(val: string) {
    return val;
  }
}