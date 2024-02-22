import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { SmartCorrectorCommand } from './smart-corrector.command';
import { InitCommand } from './init.command';

import { AskBuildExpertQuestions } from './questions/build-expert.questions';
import { CliUtilsModule } from '@bxav/cli-utils';
import { CliConfigService } from './cli-config.service';

@Module({
  imports: [ConfigModule.forRoot(), CliUtilsModule],
  providers: [
    CliConfigService,
    SmartCorrectorCommand,
    InitCommand,
    AskBuildExpertQuestions,
  ],
})
export class AppModule {}
