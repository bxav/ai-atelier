import { Module } from '@nestjs/common';

import { CompletionsController } from './completions.controller';
import { ModelBuilderService } from './model-builder.service';
import { ModelModule } from '../model/model.module';

@Module({
  imports: [ModelModule],
  controllers: [CompletionsController],
  providers: [ModelBuilderService],
})
export class CompletionModule {}
