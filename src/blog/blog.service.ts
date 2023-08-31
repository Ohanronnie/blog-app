import {
  Injectable,
  Inject,
  forwardRef,
  Logger,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog } from './blog.schema';
import { User } from '../users/user.schema';
import { IPost, IUpdatePost } from './interfaces/post';
import { UserService } from '../users/user.service';
@Injectable()
export class BlogService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @InjectModel(Blog.name) private readonly blogModel: Model<Blog>,
  ) {}
  changeUsername(prev: string, current: string) {
    return this.blogModel.updateMany({ username: prev }, { username: current });
  }
  validatePost(data: IPost['content']) {
    const errors = [];
    data.forEach((post, index) => {
      if (post.type === 'image') {
        if (!post.alt)
          errors.push(
            `content.${index}.alt must not be empty when adding an image`,
          );
      }
      if (post.type === 'code') {
        if (!post.code)
          errors.push(
            `content.${index}.code must not be empty when adding a code block`,
          );
      }
      if (post.type === 'url') {
        if (!post.url)
          errors.push(
            `content.${index}.url must not be empty when adding a url`,
          );
      }
      if (
        (post.alt && post.code) ||
        (post.code && post.url) ||
        (post.alt && post.url)
      ) {
        errors.unshift(
          `You can't add multiple type in a div @content.${index}`,
        );
      }
    });
    return errors;
  }
  mapPost(post: any) {
    return {
      title: post.title,
      id: post._id,
      author: post.author,
      createdAt: post.createdAt,
      lastModified: post.lastModified,
      content: post.content,
    };
  }
  async createPost(data: IPost, email: string) {
    const errors = [];
    if (Array.isArray(data.content)) {
      errors.push(...this.validatePost(data.content));
    } else {
      return new BadRequestException('content must be a valid Array');
    }
    if (errors.length > 0)
      return new BadRequestException(errors || errors.join(', '));
    const author = await this.userService.getUsernameWithEmail(email);
    const blog = await this.blogModel.create({ ...data, author: author });
    return this.mapPost(blog);
  }
  async getPost(author: string, id: string) {
    const blog = await this.blogModel.findOne({ author, _id: id });
    return blog ? this.mapPost(blog) : null;
  }
  async deletePost(id: string, email: string) {
    const username = await this.userService.getUsernameWithEmail(email);
    const post = await this.blogModel.findById(id);
    if (!post) return false;
    if (username === post.author) await this.blogModel.findByIdAndDelete(id);
    else return false;
    return true;
  }
  async updatePost(id: string, { content }: IUpdatePost, email: string) {
    console.log(this.blogModel.updateMany);
    const errors = [];
    if (Array.isArray(content)) {
      errors.push(...this.validatePost(content));
    } else {
      return new BadRequestException('content must be a valid Array');
    }
    if (errors.length > 0)
      return new BadRequestException(errors || errors.join(', '));
    const author = await this.userService.getUsernameWithEmail(email);
    const post = await this.blogModel.findOne({ _id: id });
    if (!post) return false;
    else if (post.author !== author) return new UnauthorizedException();
    else {
      return this.blogModel.findByIdAndUpdate(id, {
        content,
        lastModified: new Date(),
      });
    }
  }
}
