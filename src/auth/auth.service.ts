import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "../user/models/user.interface";
import { from, Observable } from "rxjs";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  constructor(private readonly jwtService: JwtService){}

  generateJWT(user: User): Observable <string> {
    return from(this.jwtService.signAsync({user}));
  }

  hashPassword(password: string): Observable <string> {
    return from(bcrypt.hash(password, 12));
  }

  comparePasswords(newPassword: string, passwordHash: string): Observable<boolean>{
    return from(bcrypt.compare(newPassword, passwordHash));
  }
}