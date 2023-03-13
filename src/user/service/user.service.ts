import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { UserEntity } from "../models/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { User, UserRole } from "../models/user.interface";
import { Observable, from, throwError, of } from "rxjs";
import { switchMap, map, catchError} from 'rxjs/operators';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  ) {}

  create(user: User): Observable<User> {
    // return this.authService.hashPassword(user.password).pipe(
    //   switchMap((passwordHash: string) => {
        const newUser = new UserEntity();
        newUser.name = user.name;
        newUser.username = user.username;
        newUser.email = user.email;
        //newUser.password = passwordHash;
        newUser.password = user.password;
        //newUser.role = UserRole.USER;

      return from(this.userRepository.save(newUser))

        return from(this.userRepository.save(newUser)).pipe(
          map((user: User) => {
            const {password, ...result} = user;
            return result;
          }),
          catchError(err => throwError(err))
        )
    //   })
    // )
  }



  findOne(id: number): Observable<User|Object> {
    return from(this.userRepository.findOneBy({id} )).pipe(
      map((user: User) => {
        if(!user){
          return { message:"Not found" }
        }
        const {password, ...result} = user;
        return result;
      })
    )
  }

  findAll(): Observable<User[]> {
    return from(this.userRepository.find()).pipe(
      map((users: User[]) => {
        users.forEach(function (v) {delete v.password});
        return users;
      })
    );
  }

  deleteOne(id: number): Observable<any> {
    return from(this.userRepository.delete(id)).pipe(
      map((data: any) => {
        if(data.affected){
          return { message: "OK" }
        }
        return  { message: "Not found" };
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

}