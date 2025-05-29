import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'usuario-ldap',
    description: 'Nombre de usuario para autenticación LDAP'
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    example: 'contraseña-segura',
    description: 'Contraseña del usuario'
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
