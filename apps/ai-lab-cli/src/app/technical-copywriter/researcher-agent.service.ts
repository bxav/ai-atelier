import { Injectable } from '@nestjs/common';
import { TavilySearchResults } from '@langchain/community/tools/tavily_search';

import { AgentService } from './agent.service';

const tavilyTool = new TavilySearchResults();

@Injectable()
export class ResearcherAgentService {
  private tavilyTool: any;

  constructor(private readonly agentService: AgentService) {
    this.tavilyTool = tavilyTool;
  }

  async createNode(name: string, llm: any) {
    const agent = await this.agentService.createAgent(
      llm,
      [this.tavilyTool],
      'You are a web researcher. You do your research in english. You may use the Tavily search engine to search the web for' +
        ' important information, so copywriter in your team can make useful documents.'
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
