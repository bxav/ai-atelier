import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { AgentService } from './technical-copywriter/agent.service';
import { AskObjectiveQuestions } from './questions/ask-objective.questions';
import { AskPathQuestions } from './questions/ask-path.questions';
import { CreatePitchesCommand } from './create-pitches/create-pitches.command';
import { ResearcherAgentService } from './technical-copywriter/researcher-agent.service';
import { StateGraphBuilder } from './technical-copywriter/state-graph.builder';
import { SupervisorService } from './technical-copywriter/supervisor.service';
import { TechnicalCopywriterAgentService } from './technical-copywriter/technical-copywriter-agent.service';
import { TechnicalCopywriterCommand } from './technical-copywriter/technical-copywriter.command';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [
    AgentService,
    SupervisorService,
    StateGraphBuilder,
    ResearcherAgentService,
    CreatePitchesCommand,
    TechnicalCopywriterCommand,
    TechnicalCopywriterAgentService,
    AskPathQuestions,
    AskObjectiveQuestions,
  ],
})
export class AppModule {}
