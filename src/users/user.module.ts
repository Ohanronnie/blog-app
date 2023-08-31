import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { UserController } from './controller/user.controller';
import { JwtModule } from '@nestjs/jwt';
import { BlogModule } from '../blog/blog.module';
import * as bcrypt from 'bcryptjs';

@Module({
  imports: [
    forwardRef(() => BlogModule),
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.pre('save', async function (next: Function) {
            if (this.isNew || this.isModified('password')) {
              if (!this.password) return next();
              this.password = bcrypt.hashSync(this.password, 10);
              next();
            }
          });
          return schema;
        },
      },
    ]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
