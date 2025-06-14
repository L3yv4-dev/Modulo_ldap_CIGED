import { Injectable, UnauthorizedException } from '@nestjs/common';
import { authenticate } from 'ldap-authentication';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  
  private readonly ldapUrl: string;
  private readonly baseDN: string;
  private readonly adminDn: string;
  private readonly adminPassword: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {
    
    this.ldapUrl = this.configService.get<string>('LDAP_URL') || '';
    this.baseDN = this.configService.get<string>('BASE_DN') || '';
    this.adminDn = this.configService.get<string>('ADMIN_DN') || '';
    this.adminPassword = this.configService.get<string>('ADMIN_PASSWORD') || '';
  }

  async validateUser(username: string, password: string): Promise<any> {
    console.log('usuario: ' + username + '\n' + 'pass: ' + password);
    try {
      // 1. Autenticación LDAP y obtención de datos del usuario
      const user = await authenticate({
        ldapOpts: {
          url: this.ldapUrl,
          connectTimeout: 3000, // Mejor manejo de tiempo de espera
        },
        userSearchBase: this.baseDN,
        usernameAttribute: 'sAMAccountName', // Atributo de búsqueda
        username: username, // Nombre de usuario proporcionado
        userPassword: password, // Contraseña proporcionada
        attributes: ['dn', 'mail', 'sAMAccountName'], // Datos requeridos
        adminDn: this.adminDn,
        adminPassword: this.adminPassword
      });

 
      // 2. Validación de existencia del usuario
      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      // 3. Sincronización con base de datos local
      const userEntity = await this.usersService.createOrUpdate({
        username: user.sAMAccountName,
        email: user.mail,
        dn: user.dn,
        roles: 'user',
      });

      return userEntity;
    } catch (error) {
      // 4. Manejo unificado de errores
      throw new UnauthorizedException('Credenciales inválidas');
    }
  }

  async login(user: any) {
    // 5. Generación del JWT (igual que antes)
    const payload = { 
      username: user.username, 
      sub: user.id, 
      roles: user.roles 
    };
    
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
