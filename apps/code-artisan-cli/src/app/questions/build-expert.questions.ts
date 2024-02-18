import { Question, QuestionSet } from 'nest-commander';

@QuestionSet({ name: 'ask-build-expert-questions' })
export class AskBuildExpertQuestions {
  @Question({
		message: "What example would you like to load? You can update this later in the .codeartisan/config.yml file.",
		name: "expertType",
		choices: ["next", "nestjs", "c++", "python"],
    default: "next",
		type: "list",
	})
	parseExpertType(type: string): string {
		return type;
	}
}
