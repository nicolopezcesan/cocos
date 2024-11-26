// import { HttpException, Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';

// @Injectable()
// export class AuthMiddleware implements NestMiddleware {
//   use(request: Request, next: NextFunction) {
//     const userId = request.header('USER_ID');

//     if (!userId) {
//       throw new UnauthorizedException({
//         message: 'USER_ID header is required',
//       });
//     }

//     // Agregar el USER_ID a la request
//     request.USER_ID = userId;

//     next();
//   }
// }
