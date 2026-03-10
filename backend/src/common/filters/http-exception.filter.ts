import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Request, Response } from 'express';

interface ErrorResponseBody {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  path: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const timestamp = new Date().toISOString();

    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      let message: string | string[] = exception.message;
      let error = exception.name;

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        error = exception.name;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseBody = exceptionResponse as Record<string, unknown>;

        message =
          (responseBody.message as string | string[] | undefined) ?? exception.message;
        error = (responseBody.error as string | undefined) ?? exception.name;
      }

      response.status(statusCode).json({
        statusCode,
        message,
        error,
        timestamp,
        path: request.url,
      } satisfies ErrorResponseBody);
      return;
    }

    if (exception instanceof PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        response.status(HttpStatus.CONFLICT).json({
          statusCode: HttpStatus.CONFLICT,
          message: 'Data duplikat terdeteksi.',
          error: 'Conflict',
          timestamp,
          path: request.url,
        } satisfies ErrorResponseBody);
        return;
      }

      if (exception.code === 'P2025') {
        response.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Data yang diminta tidak ditemukan.',
          error: 'Not Found',
          timestamp,
          path: request.url,
        } satisfies ErrorResponseBody);
        return;
      }
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Terjadi kesalahan pada server.',
      error: 'Internal Server Error',
      timestamp,
      path: request.url,
    } satisfies ErrorResponseBody);
  }
}
