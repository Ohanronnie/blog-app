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
  Query,
  HttpException,
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
  // Uncomment the following lines to add google oauth route

  /*  @Get('google/login')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  getGoogle(@Req() res: Request, @Query() query: any, @Body() body: any ) {
    console.log(res, query, body)
  }*/
  @Post('/username')
  @UseGuards(AuthGuard('jwt'))
  async changeUsername(
    @User() user: IUser,
    @Body() changeUserDto: CreateUsernameDto,
  ) {
    const username = await this.userService.createUsername(user, changeUserDto);
    if (username instanceof HttpException) throw username;
    return username;
  }
}
