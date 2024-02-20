import { Question, QuestionSet } from 'nest-commander';

@QuestionSet({ name: 'ask-openai-key-questions' })
export class AskOpenaiKeyQuestions {
  @Question({
    message:
      'What is your openai key? (You can also set OPENAI_API_KEY environment variable)',
    name: 'openaiKey',
  })
  parseOpenaiKey(val: string) {
    return val;
  }
}
