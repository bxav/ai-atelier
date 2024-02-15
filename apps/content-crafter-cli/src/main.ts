#!/usr/bin/env node

import 'dotenv/config';

import { AppModule } from './app/app.module';
import { CommandFactory } from 'nest-commander';

async function bootstrap() {
  await CommandFactory.run(AppModule);
}

bootstrap();
