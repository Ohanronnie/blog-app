export interface IPost {
  title: string;
  content: IContent[];
}
export interface IUpdatePost {
  content: IContent[];
}
export interface IContent {
  // the type of the content: image, code, url, html tags like h1-6,p, title, header
  type: string;
  // the content: for urls, this should be the value
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
