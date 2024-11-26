import { IsOptional, IsString } from 'class-validator';

export class GetAssetsFilterDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  ticker?: string;
}
