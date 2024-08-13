import { API } from '../api/contract';
import { generateOpenApi } from '@ts-rest/open-api';

const openApiDocument = generateOpenApi(API, {
  info: {
    title: 'Bot API',
    version: '1.0.0',
  },
});

openApiDocument.components = {
  ...openApiDocument.components,
  securitySchemes: {
    sabinAuth: {
      type: 'apiKey',
      description: 'API key',
      name: 'authorization',
      in: 'header',
    },
  },
};

openApiDocument.security = [
  {
    sabinAuth: [],
  },
];

export { openApiDocument };
