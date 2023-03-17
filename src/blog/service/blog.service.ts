import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BlogEntity } from "../models/blog.entity";
import { Repository } from "typeorm";
import { User } from "../../user/models/user.interface";
import { Blog } from "../models/blog.interface";
import { from, Observable, of } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import slugify from "slugify";

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity) private readonly blogRepository: Repository<BlogEntity>
  ) {
  }


  create(user: User, blog: Blog): Observable<Blog> {
    blog.author = user;
    return this.generateSlug(blog.title).pipe(
      switchMap((slug: string) => {
        blog.slug = slug;
        return from(this.blogRepository.save(blog));
      })
    );
  }

  findAll(): Observable<Blog[]> {
    return from(this.blogRepository.find({ relations: ["author"] }));
  }

  findOne(id: number): Observable<Blog> {
    return from(this.blogRepository.findOne({ where: { id }, relations: ["author"] }));
  }

  findByUserId(userId: number): Observable<Blog[]> {
    return from(this.blogRepository.find({
      where: { authorId: userId },
      relations: ['author']
    })).pipe(map((blogs: Blog[]) => blogs))
  }

  generateSlug(title: string): Observable<string> {
    return of(slugify(title));
  }

}