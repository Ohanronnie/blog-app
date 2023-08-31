import {
  Controller,
  Post,
  Get,
  Req,
  Body,
  BadRequestException,
  UseGuards,
  Redirect,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { CreateUserDto, CreateUsernameDto } from '../dtos/user.dto';
import { UserService } from '../user.service';
import { IUser, User } from '../utils/user.decorator';
@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('login')
  @UseGuards(AuthGuard('local'))
  login(@Req() req: Request) {
    return this.userService.createJwt({ ...req.user });
  }
  @Post('signup')
  async createUser(@Body() createUser: CreateUserDto) {
    const user = await this.userService.createUser(
      createUser.email,
      createUser.password,
    );
    if (user === 'exist') throw new BadRequestException('Email already exist.');
    return user;
  }
  @Post('')
  @UseGuards(AuthGuard('jwt'))
  @Redirect('/auth/home')
  getUser(@Req() req: Request) {
    console.log(req.user);
  }
  @Get('google/login')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @Redirect('/auth/home')
  getGoogle(@Req() req: Request) {
    console.log(req.user);
  }
  @Post('/username')
  @UseGuards(AuthGuard('jwt'))
  changeUsername(
    @User() user: IUser,
    @Body() changeUserDto: CreateUsernameDto,
  ) {
    console.log(user);
    return this.userService.createUsername(user, changeUserDto);
  }
  @Get('home')
  home(@Req() req: Request, @Res() res: Response) {
    console.log(req.user);
    res.set('location', 'null');
    res.send('67');
    res.send('32');
    res.end();
    return 'Hello from home';
  }
}
