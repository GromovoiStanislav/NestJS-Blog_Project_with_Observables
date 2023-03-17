import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Query,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Delete
} from "@nestjs/common";
import { BlogService } from "../service/blog.service";
import { JwtAuthGuard } from "../../auth/guards/jwt-guard";
import { Observable } from "rxjs";
import { Blog } from "../models/blog.interface";
import { UserIsAuthorGuard } from "../guards/user-is-author.guard";



@Controller("blogs")
export class BlogController {

  constructor(private blogService: BlogService) {
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() blog: Blog, @Request() req): Observable<Blog> {
    const user = req.user;
    return this.blogService.create(user, blog);
  }


  @Get()
  findBlogEntries(@Query("userId", ParseIntPipe) userId: number): Observable<Blog[]> {
    if (userId) {
      return this.blogService.findByUserId(userId);
    } else {
      return this.blogService.findAll();
    }
  }


  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Observable<Blog> {
    return this.blogService.findOne(id);
  }


  @UseGuards(JwtAuthGuard, UserIsAuthorGuard)
  @Put(':id')
  updateOne(@Param('id', ParseIntPipe) id: number, @Body() blog: Blog): Observable<Blog> {
    return this.blogService.updateOne(id, blog);
  }


  @UseGuards(JwtAuthGuard, UserIsAuthorGuard)
  @Delete(':id')
  deleteOne(@Param('id', ParseIntPipe) id: number): Observable<any> {
    return this.blogService.deleteOne(id);
  }

}
