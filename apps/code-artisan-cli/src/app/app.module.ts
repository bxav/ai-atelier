import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { RefactorCommand } from './refactor.command';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [RefactorCommand],
})
export class AppModule {}
