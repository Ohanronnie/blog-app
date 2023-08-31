import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
export class IContent {
  // the type of the content: image, code, url, html tags like h1-6,p, title, header
  @IsNotEmpty()
  type: string;
  // the content: for urls, this should be the value
  @IsNotEmpty()
  value: string;
  // only for url: this should be the url
  url?: string;
  // only for image: the image url
  image?: string;
  // only for image: the alt property
  alt?: string;
  //only for code blocks: the embeded link of the code source
  code?: string;
}
export class UpdatePostDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => IContent)
  content: IContent[];
}
export class CreatePostDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => IContent)
  content: IContent[];
}
