import { Injectable } from '@nestjs/common';

import { Model, models } from '@bxav/shared-ai-models-config';

@Injectable()
export class ModelService {
  async getAll(): Promise<Model[]> {
    return models;
  }

  async getOne(id: string): Promise<Model> {
    const model = models.find((model) => model.id === id);

    if (!model) {
      throw new Error(`Model not found: ${id}`);
    }

    return model;
  }
}
