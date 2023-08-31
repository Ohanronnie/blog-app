import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 } from 'uuid';
export type UserDocument = HydratedDocument<User>;
@Schema()
export class User {
  @Prop({ type: String, default: v4(), unique: true })
  username: string;
  @Prop({ type: String, required: true, lowercase: true })
  email: string;
  @Prop({ type: String })
  password: string;
  @Prop({ type: Date, default: new Date() })
  createdAt: Date;
  @Prop({ type: Number })
  googleId: number;
}
export const UserSchema = SchemaFactory.createForClass(User);
