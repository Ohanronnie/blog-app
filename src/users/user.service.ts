import {
  Injectable,
  Inject,
  BadRequestException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IUser } from './utils/user.decorator';
import { ICreateUsername } from './dtos/user.dto';
import { BlogService } from '../blog/blog.service';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => BlogService))
    private readonly blogService: BlogService,
  ) {}
  async validate(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new BadRequestException('Invalid Email');
    const validatePass = await bcrypt.compareSync(password, user.password);
    if (validatePass) return { email: user.email, id: user._id };

    throw new UnauthorizedException('Incorrect password');
  }
  async validateGoogle(email: string, id: string) {
    const emailExist = await this.userModel.findOne({ email });
    const emailAndIdExist = await this.userModel
      .findOne({ email, googleId: id })
      .select('email');
    if (emailExist && !emailAndIdExist) return false;
    else if (emailExist && emailAndIdExist) {
      return emailAndIdExist;
    } else {
      const user = await this.userModel.create({ email, googleId: id });
      return { email: user.email, _id: user._id };
    }
  }
  async createUser(email: string, password: string) {
    let user = await this.userModel.findOne({ email });
    if (user) return 'exist';
    let newUser = new this.userModel({ email, password: password });
    const createdUser = await newUser.save();
    return { id: createdUser._id };
  }
  async createJwt(user: any) {
    const payload = { email: user.email, id: user.id || user._id };
    return { token: this.jwtService.sign(payload) };
  }
  async createUsername(userDetails: IUser, usernameDetails: ICreateUsername) {
    const { password, username } = usernameDetails;
    const { email } = userDetails;
    let user = await this.userModel.findOne({ email });
    let comparedPass = bcrypt.compareSync(password, user.password);
    if (!comparedPass) return new UnauthorizedException('Incorrect Password');
    await this.blogService.changeUsername(user.username, username);
    const updated = await this.userModel.findOneAndUpdate(
      { email },
      { username },
    );
    return {
      id: updated._id,
    };
  }
  async getUsernameWithEmail(email: string) {
    return (await this.userModel.findOne({ email }).select('username'))
      .username;
  }
}
