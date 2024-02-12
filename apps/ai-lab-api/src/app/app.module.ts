import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { ApiKeyMiddleware } from './api-key.middleware';
import { CompletionModule } from './completion/completion.module';
import { ModelModule } from './model/model.module';

@Module({
  imports: [CompletionModule, ModelModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiKeyMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
