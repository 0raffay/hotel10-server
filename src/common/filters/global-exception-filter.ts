import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';

@Catch()
export class GlobalExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger();

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception instanceof HttpException ? exception.getResponse()['message'] || exception.message : 'Internal Server Error';

    // Log the error with stack trace
    this.logger.error(`${request.method} ${request.url} - ${status}: ${exception.stack}`);

    response.status(status).json({
      success: false,
      error: message,
      statusCode: status,
      path: request.url
    });
  }
}
