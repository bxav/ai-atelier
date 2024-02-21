import { Module } from '@nestjs/common';
import { ModelBuilderService } from './langchain/model-builder.service';
import { AskOpenaiKeyQuestions } from './langchain/questions/ask-openai-key.questions';
import { FileManagerService } from './files/file-manager.service';
import { LoaderService } from './files/loader.service';

@Module({
  providers: [
    FileManagerService,
    LoaderService,
    ModelBuilderService,
    AskOpenaiKeyQuestions,
  ],
  exports: [FileManagerService, LoaderService, ModelBuilderService],
})
export class CliUtilsModule {}
