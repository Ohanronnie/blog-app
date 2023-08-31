import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { IContent } from './interfaces/post';
export type BlogDocument = HydratedDocument<Blog>;

@Schema()
export class Blog {
  @Prop({ type: String, required: true })
  title: string;
  @Prop({ type: String, required: true, lowercase: true })
  author: string;
  @Prop({ type: Array, required: true })
  content: IContent[];
  @Prop({ type: Date, default: new Date() })
  createdAt: Date;
  @Prop({ type: Date, default: new Date() })
  lastModified: Date;
}
export const BlogSchema = SchemaFactory.createForClass(Blog);
