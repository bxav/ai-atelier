import { ChatPromptTemplate } from '@langchain/core/prompts';
import { END, MessageGraph } from '@langchain/langgraph';
import { RunnableLike } from '@langchain/core/runnables';

import { BaseMessage, AIMessage, HumanMessage } from '@langchain/core/messages';
import { MessagesPlaceholder } from '@langchain/core/prompts';

import {
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from '@langchain/core/prompts';

export class WriterWithReflectionAgent {
  private model: RunnableLike;
  private writerPrompt: string;
  private reviewerPrompt: string;
  private maxReviews: number;

  constructor({
    model,
    writerPrompt,
    reviewerPrompt,
    maxReviews = 6,
  }: {
    model: RunnableLike;
    writerPrompt: string;
    reviewerPrompt: string;
    maxReviews?: number;
  }) {
    this.model = model;
    this.writerPrompt = writerPrompt;
    this.reviewerPrompt = reviewerPrompt;
    this.maxReviews = maxReviews;
  }

  async createPost(instructions: string[]): Promise<string> {
    const chain = this.buildWriterPrompt().pipe(this.model);
    const reflect = this.buildReviewerPrompt().pipe(this.model);
    const workflow = this.composeWorkflow(chain, reflect);
    const agent = workflow.compile();
    const messages = await agent.invoke(
      instructions.map((i) => new HumanMessage(i))
    );
    return messages.slice(-1)[0].content;
  }

  private buildWriterPrompt(): ChatPromptTemplate {
    return ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(this.writerPrompt),
      new MessagesPlaceholder('messages'),
    ]);
  }

  private buildReviewerPrompt(): ChatPromptTemplate {
    return ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(this.reviewerPrompt),
      new MessagesPlaceholder('messages'),
    ]);
  }

  private composeWorkflow(chain: RunnableLike, reflect: RunnableLike) {
    const workflow = new MessageGraph();

    workflow.addNode('generate', this.createGenerationNode(chain));
    workflow.addNode('reflect', this.createReflectionNode(reflect));
    workflow.setEntryPoint('generate');
    workflow.addConditionalEdges('generate', this.determineContinuation());
    workflow.addEdge('reflect', 'generate');

    return workflow;
  }

  private createGenerationNode(chain) {
    return async (messages: BaseMessage[], config?) => [
      await chain.invoke(
        {
          messages,
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

  private determineContinuation() {
    return (messages: BaseMessage[]) =>
      messages.length > this.maxReviews ? END : 'reflect';
  }
}
