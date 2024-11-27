import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class UserIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const userId = request.headers['user_id'];
    
    if (!userId) {
      throw new HttpException('USER_ID is required', 400);
    }

    request.userId = parseInt(userId);
    return next.handle();
  }
}
