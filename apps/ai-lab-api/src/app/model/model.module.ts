import { Module } from '@nestjs/common';

import { ModelService } from './model.service';
import { ModelsController } from './models.controller';

@Module({
  controllers: [ModelsController],
  providers: [ModelService],
  exports: [ModelService],
})
export class ModelModule {}
