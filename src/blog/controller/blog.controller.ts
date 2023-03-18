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
  Delete, DefaultValuePipe
} from "@nestjs/common";
import { BlogService } from "../service/blog.service";
import { JwtAuthGuard } from "../../auth/guards/jwt-guard";
import { Observable } from "rxjs";
import { Blog } from "../models/blog.interface";
import { UserIsAuthorGuard } from "../guards/user-is-author.guard";

export const BLOGS_URL ='http://localhost:3000/api/blogs';

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


  // @Get()
  // findBlogEntries(@Query("userId", new DefaultValuePipe(0), ParseIntPipe) userId: number): Observable<Blog[]> {
  //   if (userId) {
  //     return this.blogService.findByUserId(userId);
  //   } else {
  //     return this.blogService.findAll();
  //   }
  // }


  @Get()
  index(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number = 10
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.blogService.paginateAll({ limit, page, route: BLOGS_URL });
  }


  @Get('user/:user')
  indexByUser(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Param('user', ParseIntPipe) userId: number
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.blogService.paginateByUser({ limit, page, route: BLOGS_URL + '/user/' + userId }, userId)
  }


  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number): Observable<Blog> {
    return this.blogService.findOne(id);
  }


  @UseGuards(JwtAuthGuard, UserIsAuthorGuard)
  @Put(":id")
  updateOne(@Param("id", ParseIntPipe) id: number, @Body() blog: Blog): Observable<Blog> {
    return this.blogService.updateOne(id, blog);
  }


  @UseGuards(JwtAuthGuard, UserIsAuthorGuard)
  @Delete(":id")
  deleteOne(@Param("id", ParseIntPipe) id: number): Observable<any> {
    return this.blogService.deleteOne(id);
  }

}
