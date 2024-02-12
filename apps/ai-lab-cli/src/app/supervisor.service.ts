import { ChatOpenAI } from '@langchain/openai';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';
import { Injectable } from '@nestjs/common';
import { JsonOutputToolsParser } from 'langchain/output_parsers';

const systemPrompt =
  'You are a supervisor tasked with managing a conversation between the' +
  ' following workers: {members}. Given the following user request,' +
  ' respond with the worker to act next. Each worker will perform a' +
  ' task and respond with their results and status. When finished,' +
  ' respond with FINISH.';

function buildOptions(members: string[]) {
  return ['FINISH', ...members];
}

function buildToolDef(options) {
  const functionDef = {
    name: 'route',
    description: 'Select the next role.',
    parameters: {
      title: 'routeSchema',
      type: 'object',
      properties: {
        next: {
          title: 'Next',
          anyOf: [{ enum: options }],
        },
      },
      required: ['next'],
    },
  };

  return {
    type: 'function',
    function: functionDef,
  };
}

@Injectable()
export class SupervisorService {
  async createSupervisorChain({
    llm,
    members,
  }: {
    llm: ChatOpenAI;
    members: string[];
  }) {
    const options = buildOptions(members);
    const prompt = await ChatPromptTemplate.fromMessages([
      ['system', systemPrompt],
      new MessagesPlaceholder('messages'),
      [
        'system',
        'Given the conversation above, who should act next?' +
          ' Or should we FINISH? Select one of: {options}',
      ],
    ]).partial({ options: options.join(', '), members: members.join(', ') });

    const toolDef = buildToolDef(options);
    const supervisorChain = prompt
      .pipe(
        llm.bind({
          tools: [toolDef as any],
          tool_choice: { type: 'function', function: { name: 'route' } },
        })
      )
      .pipe(new JsonOutputToolsParser())
      // select the first one
      .pipe((x) => x[0].args);

    return supervisorChain;
  }
}
