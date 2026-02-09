import { ApolloDriver } from '@nestjs/apollo';
import { isDev } from '../utils/is-dev.util';
import { join } from 'path';
import { ApolloDriverConfig } from '@nestjs/apollo';

export const getGraphlConfig = (): ApolloDriverConfig => {
  return {
    driver: ApolloDriver,
    playground: isDev(),
    autoSchemaFile: join(process.cwd(), '/src/schema.gql'),
    sortSchema: true,
    context: ({ req, res }) => ({ req, res }),
  };
};
