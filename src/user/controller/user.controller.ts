import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards
} from "@nestjs/common";
import { UserService } from "../service/user.service";
import { User, UserRole } from "../models/user.interface";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { hasRoles } from "../../auth/decorators/roles.decorator";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { JwtAuthGuard } from "../../auth/guards/jwt-guard";
import { Pagination } from "nestjs-typeorm-paginate";

@Controller("users")
export class UserController {
  constructor(private userService: UserService) {
  }


  @Post()
  create(@Body() user: User): Observable<User | Object> {
    return this.userService.create(user).pipe(
      //map((user: User) => user),
      catchError(err => of({ error: err.message }))
    );
  }


  // @Get()
  // findAll(): Observable<User[]> {
  //   return this.userService.findAll();
  // }


  @Get()
  index(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number = 10
  ): Observable<Pagination<User>> {
    limit = limit > 100 ? 100 : limit;
    return this.userService.paginate({ page, limit, route: "http://localhost:3000/api/users" });
  }


  @Get(":id")
  findOne(@Param("id") id: string): Observable<User | Object> {
    return this.userService.findOne(Number(id)).pipe(
      //map((user: User) => user),
      catchError(err => of({ error: err.message }))
    );
  }


  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(":id")
  deleteOne(@Param("id") id: string): Observable<any> {
    return this.userService.deleteOne(Number(id));
  }


  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(":id/role")
  updateRoleOfUser(@Param("id") id: string, @Body() user: User): Observable<User> {
    return this.userService.updateRoleOfUser(Number(id), user).pipe(
      //map((user: User) => user),
      catchError(err => of({ error: err.message }))
    );
  }


  @Put(":id")
  updateOne(@Param("id") id: string, @Body() user: User): Observable<User | Object> {
    return this.userService.updateOne(Number(id), user).pipe(
      //map((user: User) => user),
      catchError(err => of({ error: err.message }))
    );
  }


  @Post("login")
  login(@Body() user: User): Observable<Object> {
    return this.userService.login(user).pipe(
      map((jwt: string) => {
        return { access_token: jwt };
      }),
      catchError(err => of({ error: err.message }))
    );
  }

}