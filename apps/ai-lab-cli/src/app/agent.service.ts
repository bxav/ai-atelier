import { AgentExecutor, createOpenAIToolsAgent } from 'langchain/agents';
import { ChatOpenAI } from '@langchain/openai';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';
import { HumanMessage } from '@langchain/core/messages';
import { Injectable } from '@nestjs/common';
import { type RunnableConfig } from '@langchain/core/runnables';

@Injectable()
export class AgentService {
  async createAgent(llm: ChatOpenAI, tools: any[], systemPrompt: string) {
    // Each worker node will be given a name and some tools.
    const prompt = await ChatPromptTemplate.fromMessages([
      ['system', systemPrompt],
      new MessagesPlaceholder('messages'),
      new MessagesPlaceholder('agent_scratchpad'),
    ]);
    const agent = await createOpenAIToolsAgent({ llm, tools, prompt });
    return new AgentExecutor({ agent, tools });
  }

  async agentNode({ state, agent, name }, config?: RunnableConfig) {
    const result = await agent.invoke(state, config);
    return {
      messages: [new HumanMessage({ content: result.output, name })],
    };
  }
}
