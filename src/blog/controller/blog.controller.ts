import { Controller, Post, UseGuards, Request, Body, Query, Get, Param, ParseIntPipe } from "@nestjs/common";
import { BlogService } from "../service/blog.service";
import { JwtAuthGuard } from "../../auth/guards/jwt-guard";
import { Observable } from "rxjs";
import { Blog } from "../models/blog.interface";

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

}
