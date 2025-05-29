import { Controller, Post, Body} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/response.dto';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
    constructor(private authservice:AuthService){}

    @Post('login')
    @ApiOperation({ summary: 'Autenticación de usuario via LDAP' })
    @ApiBody({ type: LoginDto })
    @ApiResponse({ 
    status: 200, 
    description: 'Token JWT generado',
    type: AuthResponseDto
    })
    @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
    async login(@Body() loginDto:LoginDto):Promise<AuthResponseDto>{
        return {
         access_token: await this.authservice.authenticate(loginDto.username,loginDto.password)
        };
    }
}
