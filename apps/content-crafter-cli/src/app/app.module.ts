import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { InitCommand } from './init.command';
import { EnhanceCommand } from './enhance.command';
import { AskContentAreaQuestions } from './questions/content-area.questions';
import { CliUtilsModule } from '@bxav/cli-utils';
import { AnalyzeCommand } from './analyze.command';
import { CliConfigService } from './cli-config.service';
import { GenerateCommand } from './generate.command';

@Module({
  imports: [ConfigModule.forRoot(), CliUtilsModule],
  providers: [
    CliConfigService,
    GenerateCommand,
    AnalyzeCommand,
    InitCommand,
    EnhanceCommand,
    AskContentAreaQuestions,
  ],
})
export class AppModule {}
