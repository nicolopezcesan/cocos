import { IsOptional, IsString } from 'class-validator';

export class GetInstrumentsQueryFilter {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  ticker?: string;
}
