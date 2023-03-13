import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { UserEntity } from "../models/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { User, UserRole } from "../models/user.interface";
import { Observable, from, throwError, of } from "rxjs";
import { switchMap, map, catchError } from "rxjs/operators";
import { AuthService } from "../../auth/auth.service";

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    private authService: AuthService
  ) {
  }

  create(user: User): Observable<User> {
    return this.authService.hashPassword(user.password).pipe(
      switchMap((passwordHash: string) => {

        const newUser = new UserEntity();
        newUser.name = user.name;
        newUser.username = user.username;
        newUser.email = user.email;
        newUser.password = passwordHash;
        //newUser.role = UserRole.USER;

        return from(this.userRepository.save(newUser)).pipe(
          map((user: User) => {
            const { password, ...result } = user;
            return result;
          }),
          catchError(err => throwError(err))
        );
      })
    );
  }


  findOne(id: number): Observable<User | Object> {
    return from(this.userRepository.findOneBy({ id })).pipe(
      map((user: User) => {
        if (!user) {
          return { message: "Not found" };
        }
        const { password, ...result } = user;
        return result;
      })
    );
  }

  findAll(): Observable<User[]> {
    return from(this.userRepository.find()).pipe(
      map((users: User[]) => {
        users.forEach((user) => {
          delete user.password;
        });
        return users;
      })
    );
  }


  deleteOne(id: number): Observable<any> {
    return from(this.userRepository.delete(id)).pipe(
      map((data: any) => {
        if (data.affected) {
          return { message: "OK" };
        }
        return { message: "Not found" };
      })
    );
  }

  updateOne(id: number, user: User): Observable<any> {
    delete user.email;
    delete user.password;
    delete user.role;

    return from(this.userRepository.update(id, user)).pipe(
      switchMap(() => this.findOne(id))
    );
  }

  login(user: User): Observable<string> {
    return this.validateUser(user.email, user.password).pipe(
      switchMap((user: User) => {
        if(user) {
          return this.authService.generateJWT(user).pipe(map((jwt: string) => jwt));
        } else {
          return 'Wrong Credentials';
        }
      })
    )
  }

  validateUser(email: string, password: string): Observable<User> {
    return from(this.userRepository.findOne({where:[{ email } ],select: ['id', 'password', 'name', 'username', 'email', 'role', 'profileImage']})).pipe(
      switchMap((user: User) => this.authService.comparePasswords(password, user.password).pipe(
        map((match: boolean) => {
          if(match) {
            const {password, ...result} = user;
            return result;
          } else {
            throw Error;
          }
        })
      ))
    )
  }

}