import {
  Controller,
  Put,
  Get,
  Post,
  Delete,
  BadRequestException,
  NotFoundException,
  Body,
  HttpException,
  HttpStatus,
  UnauthorizedException,
  Param,
  UseInterceptors,
  UseGuards,
  UploadedFile,
  ParseFilePipeBuilder,
  UnsupportedMediaTypeException,
  StreamableFile,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePostDto, UpdatePostDto } from '../dtos/post.dto';
import { BlogService } from '../blog.service';
import { IUser, User } from '../../users/utils/user.decorator';
import { diskStorage } from 'multer';
import * as path from 'path';
import { createReadStream } from 'fs';
@Controller('post')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}
  @Put('new')
  @UseGuards(AuthGuard('jwt'))
  async createPost(@User() user: IUser, @Body() createPostDto: CreatePostDto) {
    const post = await this.blogService.createPost(createPostDto, user.email);
    if (post instanceof HttpException) throw post;
    return post;
  }
  @Get('get/:author/:postid')
  async getPost(
    @Param('author') author: string,
    @Param('postid') postId: string,
  ) {
    try {
      const post = await this.blogService.getPost(
        author.toLocaleLowerCase(),
        postId,
      );
      if (!post) throw new NotFoundException('Post not found');
      return post;
    } catch (err: any) {
      throw new NotFoundException('Post not found');
    }
  }
  @Delete('delete/:postid')
  @UseGuards(AuthGuard('jwt'))
  async deletePost(@Param('postid') id: string, @User() user: IUser) {
    try {
      const deleted = this.blogService.deletePost(id, user.email);
      if (!deleted) throw new UnauthorizedException();
      return {
        message: 'OK',
        statusCode: HttpStatus.OK,
      };
    } catch (err: any) {
      throw new NotFoundException('Post not found');
    }
  }
  @Put('update/:postid')
  @UseGuards(AuthGuard('jwt'))
  async updatePost(
    @Param('postid') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @User() user: IUser,
  ) {
    try {
      const updated = await this.blogService.updatePost(
        id,
        updatePostDto,
        user.email,
      );
      if (!updated) throw new NotFoundException('Post not found');
      else if (updated instanceof HttpException) throw updated;
      return {
        message: 'OK',
        statusCode: HttpStatus.OK,
      };
    } catch (err: any) {
      throw new NotFoundException('Post not found');
    }
  }
  @Post('upload')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: path.join('uploads'),
        filename: (req, file, cb) => {
          const [name, ext] = file.originalname.split('.');
          const fileName = `${name}${Date.now().toString(32)}.${ext}`;
          cb(null, fileName);
        },
      }),
      limits: {
        fileSize: 1024 * 1024 * 10,
      },
      fileFilter: (req, file, cb) => {
        const fileRegexp = /.(jpeg|jpg|gif|png|webp)$/;
        if (!fileRegexp.test(file.mimetype))
          return cb(
            new UnsupportedMediaTypeException(
              'Only image files (png, jpg, gif, webp) are allowed',
            ),
            false,
          );
        cb(null, true);
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      statusCode: HttpStatus.OK,
      path: file.filename,
    };
  }
  @Get('image/:path')
  sendImage(@Param('path') location: string) {
    return new StreamableFile(
      createReadStream(path.join(process.cwd(), 'uploads', location)),
    );
  }
}
