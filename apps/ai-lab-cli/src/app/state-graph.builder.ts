import { BaseMessage } from '@langchain/core/messages';
import { END, StateGraph } from '@langchain/langgraph';
import { Injectable } from '@nestjs/common';
import { Pregel } from '@langchain/langgraph/pregel';

interface AgentStateChannels {
  messages: {
    value: (x: BaseMessage[], y: BaseMessage[]) => BaseMessage[];
    default: () => BaseMessage[];
  };
  next: string;
}

// This defines the agent state
const agentStateChannels: AgentStateChannels = {
  messages: {
    value: (x: BaseMessage[], y: BaseMessage[]) => x.concat(y),
    default: () => [],
  },
  next: 'initialValueForNext', // Replace 'initialValueForNext' with your initial value if needed
};

@Injectable()
export class StateGraphBuilder {
  private workflow: StateGraph<any>;
  private channels: any;

  constructor() {
    this.channels = agentStateChannels;
  }

  createNewWorkflow(): StateGraphBuilder {
    this.workflow = new StateGraph({
      channels: this.channels,
    });
    return this;
  }

  addNode(name: string, node: any): StateGraphBuilder {
    this.workflow.addNode(name, node);
    return this;
  }

  addEdge(from: string, to: string): StateGraphBuilder {
    this.workflow.addEdge(from, to);
    return this;
  }

  addConditionalEdges(startKey: string, members: string[]): StateGraphBuilder {
    const conditionalMap: { [key: string]: string } = members.reduce(
      (acc, member) => {
        acc[member] = member;
        return acc;
      },
      {}
    );

    conditionalMap['FINISH'] = END;

    this.workflow.addConditionalEdges(
      startKey,
      (x: AgentStateChannels) => x.next,
      conditionalMap
    );
    // Add your logic to add conditional edges using conditionalMap
    return this;
  }

  setEntryPoint(entryPoint: string): StateGraphBuilder {
    this.workflow.setEntryPoint(entryPoint);
    return this;
  }

  build(): Pregel {
    return this.workflow.compile();
  }
}
