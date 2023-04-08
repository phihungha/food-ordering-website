import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, map } from 'rxjs';

@Injectable()
export class LoginStatusInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest() as Request;
    const user = request.user;
    const isSignedIn = user !== undefined;
    return next.handle().pipe(map((r) => ({ ...r, isSignedIn })));
  }
}
