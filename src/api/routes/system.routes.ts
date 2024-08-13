import { initContract } from '@ts-rest/core';
import { z } from 'zod';

export const system = {
  routes: initContract().router({
    getHealthCheck: {
      method: 'GET',
      path: `/`,
      responses: {
        200: z.object({
          status: z.literal('OK'),
        }),
      },
      strictStatusCodes: true,
      summary: 'Health check',
    },
  }),
};
