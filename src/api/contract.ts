import { initContract } from '@ts-rest/core';
import { z } from 'zod';

import { bot } from './routes/bot.routes';
import { system } from './routes/system.routes';

export const API = initContract().router(
  {
    System: system.routes,
    Bot: bot.routes,
  },
  {
    baseHeaders: z.object({
      authorization: z.string().optional(),
    }),
  },
);
