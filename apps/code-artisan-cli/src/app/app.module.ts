import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { SmartCorrectorCommand } from './smart-corrector.command';
import { InitCommand } from './init.command';

import { AskBuildExpertQuestions } from './questions/build-expert.questions';
import { CliUtilsModule } from '@bxav/cli-utils';
import { CliConfigService } from './cli-config.service';
import { SmartCorrectorService } from './smart-corrector.service';
import { CodeLinterAgentService } from './code-linter-agent.service';
import { CodeLinterAlphaCommand } from './code-linter-alpha.command';

@Module({
  imports: [ConfigModule.forRoot(), CliUtilsModule],
  providers: [
    CliConfigService,
    SmartCorrectorService,
    CodeLinterAgentService,
    SmartCorrectorCommand,
    CodeLinterAlphaCommand,
    InitCommand,
    AskBuildExpertQuestions,
  ],
})
export class AppModule {}
