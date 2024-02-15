import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { GenerateCommand } from './generate.command';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [GenerateCommand],
})
export class AppModule {}
