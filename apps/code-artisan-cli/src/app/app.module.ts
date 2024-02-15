import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { ReactRefactorCommand } from './react-refactor.command';
import { AskOpenaiKeyQuestions } from './questions/ask-openai-key.questions';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [ReactRefactorCommand, AskOpenaiKeyQuestions],
})
export class AppModule {}
