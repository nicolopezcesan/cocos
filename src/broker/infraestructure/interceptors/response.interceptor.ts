import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus, BadRequestException } from "@nestjs/common";
import { Observable, map, catchError, throwError } from "rxjs";

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((res: unknown) => this.responseHandler(res, context)),
      catchError((err: HttpException) => throwError(() => this.handleError(err, context)))
    );
  }

  handleError(error: unknown, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    let status: HttpStatus;
    let message: string;

    if (error instanceof HttpException) {
      status = error.getStatus();
      message = error.message || 'An unexpected error occurred';
    } else if (error instanceof BadRequestException) {
      status = HttpStatus.BAD_REQUEST;
      message = error.message || 'Bad request';
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'An internal server error occurred';
    }

    response.status(status).json({
      status: false,
      statusCode: status,
      message: message,
      data: null,
    });
  }


  responseHandler(res: unknown, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    const statusCode = response.statusCode;

    return {
      status: true,
      statusCode,
      data: res,
    };
  }
}