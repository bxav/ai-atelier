import { ChatPromptTemplate } from '@langchain/core/prompts';
import { END, MessageGraph } from '@langchain/langgraph';
import { RunnableLike } from '@langchain/core/runnables';

import { BaseMessage, AIMessage, HumanMessage } from '@langchain/core/messages';
import { MessagesPlaceholder } from '@langchain/core/prompts';

import {
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from '@langchain/core/prompts';

type RefactorConfig = {
  model: RunnableLike;
  prompt: string;
  role: string;
  codingStyles: string;
  examples: string;
};

export class CodeLinterAgent {
  private model: RunnableLike;
  private prompt: string;
  private role: string;
  private codingStyles: string;
  private examples: string;

  constructor({ model, prompt, role, codingStyles, examples }: RefactorConfig) {
    this.model = model;
    this.prompt = prompt;
    this.role = role;
    this.codingStyles = codingStyles;
    this.examples = examples;
  }

  async refactorFile(codeToRefactor: string): Promise<string> {
    const chain = this.buildRefactorPrompt().pipe(this.model);
    const reflect = this.buildReflectionPrompt().pipe(this.model);
    const workflow = this.composeWorkflow(chain, reflect);
    const agent = workflow.compile();
    const initialMessages = this.constructInitialMessages(codeToRefactor);
    const messages = await agent.invoke(initialMessages);
    return messages.slice(-1)[0].content;
  }

  private buildRefactorPrompt(): ChatPromptTemplate {
    return ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(this.prompt),
      new MessagesPlaceholder('messages'),
    ]);
  }

  private buildReflectionPrompt(): ChatPromptTemplate {
    const reflectionMessage = `You are a senior developer reviewing a pull request. Provide detailed recommendations, including adherence to guidelines and ensuring no breaking changes.`;
    return ChatPromptTemplate.fromMessages([
      HumanMessagePromptTemplate.fromTemplate(reflectionMessage),
      new MessagesPlaceholder('messages'),
    ]);
  }

  private composeWorkflow(chain: RunnableLike, reflect: RunnableLike) {
    const workflow = new MessageGraph();

    workflow.addNode('generate', this.createGenerationNode(chain));
    workflow.addNode('reflect', this.createReflectionNode(reflect));
    workflow.setEntryPoint('generate');
    workflow.addConditionalEdges('generate', this.determineContinuation);
    workflow.addEdge('reflect', 'generate');

    return workflow;
  }

  private createGenerationNode(chain) {
    return async (messages: BaseMessage[], config?) => [
      await chain.invoke(
        {
          messages,
          codingStyles: this.codingStyles,
          examples: this.examples,
          role: this.role,
        },
        config
      ),
    ];
  }

  private createReflectionNode(reflect) {
    return async (messages: BaseMessage[], config?) => {
      const clsMap = { ai: HumanMessage, human: AIMessage };
      const translated = messages.map((msg, i) =>
        i === 0 ? msg : new clsMap[msg._getType()](msg.content)
      );
      const res = await reflect.invoke({ messages: translated }, config);
      return [new HumanMessage(res.content)];
    };
  }

  private determineContinuation(messages: BaseMessage[]) {
    return messages.length > 6 ? END : 'reflect';
  }

  private constructInitialMessages(codeToRefactor: string): BaseMessage[] {
    const initialMessageContent = `Refactor the following code and respond directly to this message with the refactored code without adding markdown around. Here is the code to refactor:`;

    return [
      new HumanMessage(initialMessageContent),
      new HumanMessage(codeToRefactor),
    ];
  }
}
