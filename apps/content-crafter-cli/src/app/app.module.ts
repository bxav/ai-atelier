import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { InitCommand } from './init.command';
import { CliUtilsModule } from '@bxav/cli-utils';
import { CliConfigService } from './cli-config.service';
import { CreateCommand } from './create.command';
import { AskObjectiveQuestions } from './questions/ask-objective.questions';

@Module({
  imports: [ConfigModule.forRoot(), CliUtilsModule],
  providers: [
    CliConfigService,
    CreateCommand,
    InitCommand,
    AskObjectiveQuestions,
  ],
})
export class AppModule {}
