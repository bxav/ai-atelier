import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { SmartCorrectorCommand } from './smart-corrector.command';
import { InitCommand } from './init.command';

import { AskBuildExpertQuestions } from './questions/build-expert.questions';
import { CliUtilsModule } from '@bxav/cli-utils';
import { ConfigService } from './config.service';

@Module({
  imports: [ConfigModule.forRoot(), CliUtilsModule],
  providers: [
    ConfigService,
    SmartCorrectorCommand,
    InitCommand,
    AskBuildExpertQuestions,
  ],
})
export class AppModule {}
