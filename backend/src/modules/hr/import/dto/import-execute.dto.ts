import { IsNotEmpty, IsString } from 'class-validator';

export class ImportExecuteDto {
  @IsString()
  @IsNotEmpty()
  sessionId: string;
}
