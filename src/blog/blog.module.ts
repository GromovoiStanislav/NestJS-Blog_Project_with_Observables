import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { BlogEntity } from "./models/blog.entity";
import { BlogController } from './controller/blog.controller';
import { BlogService } from './service/blog.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlogEntity]),],
  controllers: [BlogController],
  providers: [BlogService]
})
export class BlogModule {}
