import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { AgentService } from './agent.service';
import { AskObjectiveQuestions } from './questions/ask-objective.questions';
import { AskPathQuestions } from './questions/ask-path.questions';
import { CreatePitchesCommand } from './create-pitches.command';
import { ReactExpertCommand } from './react-expert.command';
import { ResearcherAgentService } from './researcher-agent.service';
import { StateGraphBuilder } from './state-graph.builder';
import { SupervisorService } from './supervisor.service';
import { TechnicalCopywriterAgentService } from './technical-copywriter-agent.service';
import { TechnicalCopywriterCommand } from './technical-copywriter.command';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [
    AgentService,
    SupervisorService,
    StateGraphBuilder,
    ResearcherAgentService,
    CreatePitchesCommand,
    ReactExpertCommand,
    TechnicalCopywriterCommand,
    TechnicalCopywriterAgentService,
    AskPathQuestions,
    AskObjectiveQuestions,
  ],
})
export class AppModule {}
