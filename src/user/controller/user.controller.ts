import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put, Request,Response,
  Query, UploadedFile,
  UseGuards, UseInterceptors
} from "@nestjs/common";
import { UserService } from "../service/user.service";
import { User, UserRole } from "../models/user.interface";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { hasRoles } from "../../auth/decorators/roles.decorator";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { JwtAuthGuard } from "../../auth/guards/jwt-guard";
import { Pagination } from "nestjs-typeorm-paginate";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from 'multer';
import * as path from 'node:path';
import { randomUUID } from "node:crypto";
import { UserIsUserGuard } from "../../auth/guards/UserIsUser.guard";


export const storage = {
  storage: diskStorage({
    destination: './uploads/profileimages',
    filename: (req, file, cb) => {
      const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + randomUUID();
      const extension: string = path.parse(file.originalname).ext;
      //const extension: string = path.extname(file.originalname);
      cb(null, `${filename}${extension}`)
    }
  })
}

export const USERS_URL ='http://localhost:3000/api/users';

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
  findAll(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Observable<Pagination<User>> {
    limit = limit > 100 ? 100 : limit;
    page = page <1 ? 1 : page;
    return this.userService.paginate({ page, limit, route: USERS_URL});
  }

  @Get('search/by/username/:username')
  findAllByUsername(
    @Param('username') username: string,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Observable<Pagination<User>> {
    return this.userService.paginateFilterByUsername(
      { page, limit, route: `${USERS_URL}/search/by/username/${username}` },
      {username}
    );
  }



  // @Get()
  // index(
  //   @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
  //   @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  //   @Query("username") username: string
  // ): Observable<Pagination<User>> {
  //   limit = limit > 100 ? 100 : limit;
  //   page = page <1 ? 1 : page;
  //   if (username) {
  //     return this.userService.paginateFilterByUsername_OLD(
  //       { page, limit, route: USERS_URL }, { username }
  //     );
  //   } else {
  //     return this.userService.paginate_OLD({ page, limit, route: USERS_URL });
  //   }
  // }


  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number): Observable<User | Object> {
    return this.userService.findOne(id).pipe(
      //map((user: User) => user),
      catchError(err => of({ error: err.message }))
    );
  }


  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(":id")
  deleteOne(@Param("id", ParseIntPipe) id: number): Observable<any> {
    return this.userService.deleteOne(id);
  }


  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(":id/role")
  updateRoleOfUser(@Param("id", ParseIntPipe) id: number, @Body() user: User): Observable<User> {
    return this.userService.updateRoleOfUser(id, user).pipe(
      //map((user: User) => user),
      catchError(err => of({ error: err.message }))
    );
  }


  @UseGuards(JwtAuthGuard, UserIsUserGuard)
  @Put(":id")
  updateOne(@Param("id", ParseIntPipe) id: number, @Body() user: User): Observable<User | Object> {
    return this.userService.updateOne(id, user).pipe(
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


  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file',storage))
  uploadFile(@UploadedFile() file: Express.Multer.File, @Request() req): Observable<Object> {
    const user: User = req.user;
    return this.userService.updateOne(user.id, {profileImage: file.filename}).pipe(
      map((user:User) => ({profileImage: user.profileImage}))
    )
  }


  @Get('profile-image/:imagename')
  findProfileImage(@Param('imagename') imagename, @Response() res): Observable<Object> {
    return of(res.sendFile(path.join(process.cwd(), 'uploads/profileimages' ,imagename)));
  }

}



