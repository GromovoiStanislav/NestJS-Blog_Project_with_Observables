import { CanActivate, ExecutionContext, forwardRef, Inject, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { UserService } from "../../user/service/user.service";
import { User } from "../../user/models/user.interface";
import { map } from "rxjs/operators";

@Injectable()
export class UserIsUserGuard implements CanActivate {

  constructor(
    //@Inject(forwardRef(() => UserService)) private userService: UserService
  ) {
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const params = request.params;
    const user: User = request.user;

    return user.id === Number(params.id)

    // return this.userService.findOne(user.id).pipe(
    //   map((user: User) => {
    //     let hasPermission = false;
    //
    //     if(user.id === Number(params.id)) {
    //       hasPermission = true;
    //     }
    //
    //     return user && hasPermission;
    //   })
    // )
  }

}
