import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

const STATUS_QUERY_MAP = {
  aktif: 'Aktif',
  'tidak aktif': 'Tidak Aktif',
} as const;

export class PaginationQueryDto {
  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value, 10))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value, 10))
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value !== 'string') {
      return value;
    }

    const normalizedValue = value.trim().toLowerCase();

    return STATUS_QUERY_MAP[normalizedValue as keyof typeof STATUS_QUERY_MAP] ?? value.trim();
  })
  @IsIn(['Aktif', 'Tidak Aktif'])
  status?: string;
}
