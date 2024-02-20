import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { AnalyzeCommand } from './analize.command';
import { InitCommand } from './init.command';
import { EnhanceCommand } from './enhance.command';
import { AskContentAreaQuestions } from './questions/content-area.questions';
import { FileManagerService } from '@bxav/cli-utils';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [
    FileManagerService,
    AnalyzeCommand,
    InitCommand,
    EnhanceCommand,
    AskContentAreaQuestions,
  ],
})
export class AppModule {}
