import { Module, forwardRef } from '@nestjs/common';
import { BlogService } from './blog.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogController } from './controllers/blog.controller';
import { Blog, BlogSchema } from './blog.schema';
import { UserModule } from '../users/user.module';
import { MulterModule } from '@nestjs/platform-express';
@Module({
  imports: [
    forwardRef(() => UserModule),
    MongooseModule.forFeature([
      {
        name: Blog.name,
        schema: BlogSchema,
      },
    ]),
    MulterModule.register({
      dest: 'uploads',
    }),
  ],
  exports: [BlogService],
  providers: [BlogService],
  controllers: [BlogController],
})
export class BlogModule {}
