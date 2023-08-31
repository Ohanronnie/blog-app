import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(function (
  value: string,
  ctx: ExecutionContext,
) {
  const http = ctx.switchToHttp();
  const request = http.getRequest();
  return request.user;
});

export interface IUser {
  email: string;
  id: string;
}
