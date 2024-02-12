import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post } from '@nestjs/common';

import { models } from '@bxav/shared-ai-models-config';

@ApiTags('models')
@Controller('models')
export class ModelsController {
  constructor() {}

  @Get('')
  public async getAll() {
    return models;
  }
}
