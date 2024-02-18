import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { SmartCorrectorCommand } from './smart-corrector.command';
import { AskOpenaiKeyQuestions } from './questions/ask-openai-key.questions';
import { InitCommand } from './init.command';
import { AskBuildExpertQuestions } from './questions/build-expert.questions';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [
    SmartCorrectorCommand,
    InitCommand,
    AskOpenaiKeyQuestions,
    AskBuildExpertQuestions,
  ],
})
export class AppModule {}
