import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from '@langchain/core/messages';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post, Res } from '@nestjs/common';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { streamToResponse } from 'ai';

import { CreateCompletionDto } from './dto/create-completion.dto';
import { ModelBuilderService } from './model-builder.service';
import { ModelService } from '../model/model.service';

@ApiSecurity('x-api-key')
@ApiTags('completions')
@Controller('completions')
export class CompletionsController {
  constructor(
    private readonly modelService: ModelService,
    private readonly modelBuilderService: ModelBuilderService
  ) {}

  @Post('')
  public async stream(
    @Res() res,
    @Body()
    createCompletionDto: CreateCompletionDto
  ) {
    const model = await this.modelService.getOne(createCompletionDto.modelId);
    console.log(model);

    try {
      const langchainModel = this.modelBuilderService.buildModel(
        model.type,
        model.name,
        {
          temperature: createCompletionDto.temperature,
          maxTokens: createCompletionDto.maxLength,
          topP: createCompletionDto.topP,
        }
      );

      const outputParser = new StringOutputParser();

      let promptTemplate;
      if (createCompletionDto.systemPrompt && createCompletionDto.messages) {
        throw new Error(
          'You cannot provide both systemPrompt and messages at the same time'
        );
      } else if (createCompletionDto.systemPrompt) {
        promptTemplate = ChatPromptTemplate.fromTemplate(
          createCompletionDto.systemPrompt
        );
      } else if (createCompletionDto.messages) {
        promptTemplate = this.createPromptTemplateFromMessages(
          createCompletionDto.messages
        );
      }

      const chain = RunnableSequence.from([
        promptTemplate,
        langchainModel,
        outputParser,
      ]);

      const stream = await chain.stream({});

      return streamToResponse(stream, res);
    } catch (e) {
      console.log(e);
      return res.status(400).json({
        status: 'error',
        message: e.message,
      });
    }
  }

  private createPromptTemplateFromMessages(
    messages: { role: string; content: string }[]
  ) {
    const messageTypes = {
      user: HumanMessage,
      assistant: AIMessage,
      system: SystemMessage,
    };

    return ChatPromptTemplate.fromMessages(
      messages.map(({ role, content }) => {
        const MessageType = messageTypes[role];
        if (!MessageType) {
          throw new Error(`Invalid message role: ${role}`);
        }
        return new MessageType(content);
      })
    );
  }
}
