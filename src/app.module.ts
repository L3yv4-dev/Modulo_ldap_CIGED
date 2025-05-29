import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432; // 5432 es el puerto por defecto de Postgres
console.log(process.env.DB_HOST);

// @Module({
  
//   imports: [
//      TypeOrmModule.forRoot({
//       type: 'postgres',
//       host: process.env.DB_HOST,
//       port: port,
//       username: process.env.DB_USER,
//       password: process.env.DB_PASSWORD,
//       database: process.env.DB_DATABASE,
//       entities: [User],
//       synchronize: true
//     }),
//     AuthModule,

//   ],
// })

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath:'.env' }),
    
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT', 5432), // valor por defecto 5432
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [User],
        synchronize: true,
      }),
    }),
    AuthModule,
  ],
})

export class AppModule {
}
