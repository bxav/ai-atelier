import { ChatOpenAI } from '@langchain/openai';
import {
  Command,
  CommandRunner,
  InquirerService,
  Option,
} from 'nest-commander';
import { HumanMessage } from '@langchain/core/messages';

import { ResearcherAgentService } from './researcher-agent.service';
import { StateGraphBuilder } from './state-graph.builder';
import { SupervisorService } from './supervisor.service';
import { TechnicalCopywriterAgentService } from './technical-copywriter-agent.service';

const members = ['Researcher', 'TechnicalCopywriter'];

@Command({ name: 'technical-copywriter', description: 'Technical Copywriter' })
export class TechnicalCopywriterCommand extends CommandRunner {
  constructor(
    private readonly supervisorService: SupervisorService,
    private readonly reasearcherAgentService: ResearcherAgentService,
    private readonly copywriterAgentService: TechnicalCopywriterAgentService,
    private readonly inquirer: InquirerService,
    private readonly graphBuilder: StateGraphBuilder
  ) {
    super();
  }

  async run(
    passedParam: string[],
    { input }: { input?: string }
  ): Promise<void> {
    const objective = input || (await this.promptForObjective());

    const llm = new ChatOpenAI({
      modelName: 'gpt-4-1106-preview',
      temperature: 0,
    });

    const supervisorChain = await this.supervisorService.createSupervisorChain({
      llm,
      members,
    });

    const researcherNode = await this.reasearcherAgentService.createNode(
      'Researcher',
      llm
    );

    const chartGenNode = await this.copywriterAgentService.createNode(
      'TechnicalCopywriter',
      llm
    );

    const workflowBuilder = this.graphBuilder
      .createNewWorkflow()
      .addNode('Researcher', researcherNode)
      .addNode('TechnicalCopywriter', chartGenNode)
      .addNode('supervisor', supervisorChain);

    members.forEach((member) => {
      workflowBuilder.addEdge(member, 'supervisor');
    });

    workflowBuilder.addConditionalEdges('supervisor', members);
    workflowBuilder.setEntryPoint('supervisor');

    const graph = workflowBuilder.build();

    const streamResults = graph.stream(
      {
        messages: [
          new HumanMessage({
            content: objective,
          }),
        ],
      },
      { recursionLimit: 100 }
    );

    for await (const output of await streamResults) {
      if (!output?.__end__) {
        console.log(JSON.stringify(output));
        console.log('----');
      }
    }
  }

  @Option({
    flags: '-i, --input [string]',
    description: 'Your objective',
  })
  parseInput(val: string): string {
    return val;
  }

  async promptForPath(): Promise<string> {
    const { path } = await this.inquirer.ask<{ path: string }>(
      'ask-path-questions',
      undefined
    );
    return path;
  }

  async promptForObjective(): Promise<string> {
    const { objective } = await this.inquirer.ask<{ objective: string }>(
      'ask-objective-questions',
      undefined
    );
    return objective;
  }
}
