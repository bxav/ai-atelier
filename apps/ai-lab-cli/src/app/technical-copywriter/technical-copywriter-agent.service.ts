import { Injectable } from '@nestjs/common';

import { AgentService } from './agent.service';
import { writeDocumentTool } from '../document-editor-tools';

@Injectable()
export class TechnicalCopywriterAgentService {
  constructor(private readonly agentService: AgentService) {}

  async createNode(name: string, llm: any) {
    const agent = await this.agentService.createAgent(
      llm,
      [writeDocumentTool],
      'You always write a document. You are a technical copywriter. You may use the research editor from the research team. You allways have to write the best technical documents and you write it in markdown format. You always write in the language asked by the user.'
    );

    return async (state, config) =>
      await this.agentService.agentNode(
        {
          state,
          agent: agent,
          name,
        },
        config
      );
  }
}
