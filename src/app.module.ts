import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { BlogModule } from './blog/blog.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRoot({
      type: 'postgres',
      //url: process.env.DATABASE_URL,
      host: '127.0.0.1',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'blog',
      autoLoadEntities: true,
      synchronize: true
    }),
    UserModule,
    AuthModule,
    BlogModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
