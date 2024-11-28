import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetInstrumentsQueryFilterDto {
  @ApiProperty({ example: 'Grim', required: false })
  @IsOptional()
  @IsString()
  name?: string;
  
  @ApiProperty({ example: 'HA', required: false })
  @IsOptional()
  @IsString()
  ticker?: string;
}
