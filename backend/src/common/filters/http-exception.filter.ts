import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const timestamp = new Date().toISOString();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const error = exception.getResponse();

      response.status(status).json({
        statusCode: status,
        timestamp,
        path: request.url,
        error,
      });
      return;
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const prismaError = exception as Prisma.PrismaClientKnownRequestError;

      if (prismaError.code === 'P2002') {
        response.status(HttpStatus.CONFLICT).json({
          statusCode: HttpStatus.CONFLICT,
          timestamp,
          path: request.url,
          message: 'Data duplikat terdeteksi.',
          code: prismaError.code,
        });
        return;
      }

      if (prismaError.code === 'P2025') {
        response.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          timestamp,
          path: request.url,
          message: 'Data yang diminta tidak ditemukan.',
          code: prismaError.code,
        });
        return;
      }
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp,
      path: request.url,
      message: 'Terjadi kesalahan pada server.',
    });
  }
}
