import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { SmartCorrectorCommand } from './smart-corrector.command';
import { InitCommand } from './init.command';

import { AskOpenaiKeyQuestions } from './questions/ask-openai-key.questions';
import { AskBuildExpertQuestions } from './questions/build-expert.questions';
import { FileManagerService } from '@bxav/cli-utils';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [
    SmartCorrectorCommand,
    InitCommand,
    FileManagerService,
    AskOpenaiKeyQuestions,
    AskBuildExpertQuestions,
  ],
})
export class AppModule {}
