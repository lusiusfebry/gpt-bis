import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{2}-\d{5}$/)
  nomor_induk_karyawan: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
