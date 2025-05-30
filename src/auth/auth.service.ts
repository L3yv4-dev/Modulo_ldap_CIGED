import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as ldap from 'ldapjs';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
@Injectable()
export class AuthService {
    private client: ldap.Client;

    constructor(
        private jwtService: JwtService,
        @InjectRepository(User) private userRepository: Repository<User>,
        private configService: ConfigService,
    ){
        const ldapUrl =  this.configService.get<string>('LDAP_URL') || 'ldap://localhost:389';
        this.client = ldap.createClient({
            url: ldapUrl,
        });
    }

    async authenticate(username:string, password:string): Promise<string>{
        const userDn = `uid=${username},ou=users,dc=example,dc=com`;

        return new Promise((resolve,reject)=>{
            this.client.bind(userDn,password, async(error)=>{
                if(error) return reject('Credenciales inválidas');

                const user = await this.userRepository.findOne({where:{username}});

                if(!user){
                    //si el usuario no existe en base de datos lo crea (preguntar)
                    // const newUser = this.userRepository.create({username});
                    // await this.userRepository.save(newUser);
                    // return reject('No exite el usuario');
                }
                const payload = {username};
                resolve(this.jwtService.sign(payload));
            });
        });
    }
}