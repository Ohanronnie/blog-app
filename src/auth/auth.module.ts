import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../users/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './auth.strategy';
import { JwtStrategy } from './jwt.strategy';
//import { GoogleStrategy } from './google.strategy';
import { BlogModule } from '../blog/blog.module';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [UserModule, PassportModule, BlogModule],
  providers: [AuthService, LocalStrategy, JwtStrategy /*, GoogleStrategy*/],
})
export class AuthModule {}
