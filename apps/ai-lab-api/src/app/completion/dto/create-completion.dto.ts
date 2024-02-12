import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class MessageParam {
  @IsString()
  role: string;

  @IsString()
  content: string;
}

export class CreateCompletionDto {
  @IsString()
  readonly modelId: string;

  @IsString()
  @IsOptional()
  readonly systemPrompt?: string;

  @IsArray()
  @IsOptional()
  readonly messages?: MessageParam[];

  @IsNumber()
  readonly temperature: number;

  @IsNumber()
  readonly maxLength: number;

  @IsNumber()
  readonly topP: number;
}
