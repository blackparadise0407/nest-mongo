import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
import helmet from 'helmet';

import { AppModule } from '@/app.module';
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    origin: (requestOrigin, cb) => {
      const origins = process.env.CORS_ORIGINS?.split(',') ?? [];

      if (!origins.length) {
        cb(null, requestOrigin);
        return;
      }

      if (!requestOrigin) {
        cb(null, requestOrigin);
        return;
      }

      if (origins.includes(requestOrigin)) {
        cb(null, requestOrigin);
      } else cb(new Error('Requested origin is not allowed'));
    },
    credentials: true,
  });
  app.use(helmet());
  app.use(cookieParser(process.env.COOKIES_SECRET));
  app.use(
    csurf({
      cookie: true,
    }),
  );

  // Validate query params and body
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Filter HTTP exceptions
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(AppModule.port);
}
bootstrap();
