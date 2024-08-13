import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { zPmmSimpleInput } from '../api/routes/bot.routes';

export const API = initContract().router({
  addControllerConfig: {
    method: 'POST',
    path: '/add-controller-config',
    body: z.object({
      name: z.string(),
      content: zPmmSimpleInput,
    }),
    responses: {
      200: z.null(),
      401: z.object({
        error: z.string(),
      }),
    },
    strictStatusCodes: true,
    summary: 'Creates a new bot configuration',
    description: 'Fuck it!',
  },
});
