import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";

import { BlogService } from "../service/blog.service";
import { User } from "../../user/models/user.interface";
import { map } from "rxjs/operators";
import { Blog } from "../models/blog.interface";

@Injectable()
export class UserIsAuthorGuard implements CanActivate {

  constructor(
    //private userService: UserService,
    private blogService: BlogService) {
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

    const request = context.switchToHttp().getRequest();

    const params = request.params;
    const blogId: number = Number(params.id);
    const user: User = request.user;

    return this.blogService.findOne(blogId).pipe(
      map((blog: Blog) => {
        if (blog) {
          return user.id === blog.author.id;
        }
        return false;
      })
    );

  }
}