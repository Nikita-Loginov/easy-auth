import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { INestApplication } from '@nestjs/common';
import { AuthModule } from '@/modules/auth/auth.module';

export const getSwaggerConfig = () => {
  return new DocumentBuilder()
    .setTitle('Easy Auth')
    .setDescription('Api для auth')
    .setVersion('1.0')
    .build();
};

export const setupSwaggerConfig = (app: INestApplication) => {
  const config = getSwaggerConfig();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, {
      include: [AuthModule],
    });
  SwaggerModule.setup('api', app, documentFactory);
};
