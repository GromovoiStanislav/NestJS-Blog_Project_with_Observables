import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { UserService } from "../service/user.service";
import { User } from "../models/user.interface";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Controller('users')
export class UserController {
  constructor(private userService: UserService) { }


  @Post()
  create(@Body() user: User): Observable<User | Object> {
    return this.userService.create(user).pipe(
      map((user: User) => user),
      catchError(err => of({ error: err.message }))
    );
  }

  @Get()
  findAll(): Observable<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Observable<User| Object> {
    return this.userService.findOne(Number(id)).pipe(
      map((user: User) => user),
      catchError(err => of({ error: err.message }))
    );
  }

  @Delete(':id')
  deleteOne(@Param('id') id: string): Observable<any> {
    return this.userService.deleteOne(Number(id));
  }

  @Put(':id')
  updateOne(@Param('id') id: string, @Body() user: User): Observable<User| Object> {
    return this.userService.updateOne(Number(id), user).pipe(
      map((user: User) => user),
      catchError(err => of({ error: err.message }))
    );
  }

}