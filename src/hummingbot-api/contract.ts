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
  },

  listBots: {
    method: 'GET',
    path: '/get-active-bots-status',
    responses: {
      200: z.object({
        data: z.record(
          z.string(),
          z.object({
            status: z.string(),
          }),
        ),
        status: z.string(),
      }),
    },
    strictStatusCodes: true,
    summary: 'list all active bots',
  },

  createBot: {
    method: 'POST',
    path: '/create-hummingbot-instance',
    body: z.object({
      instance_name: z.string(),
      credentials_profile: z.string(),
      image: z.string(),
      script: z.string(),
      script_config: z.string(),
    }),
    responses: {
      200: z.object({}),
    },
    strictStatusCodes: true,
    summary: 'create humming bot',
  },

  createScript: {
    method: 'POST',
    path: '/add-script-config',
    body: z.object({
      name: z.string(),
      content: z.object({
        markets: z.object({}),
        candles_config: z.array(z.string()),
        controllers_config: z.array(z.string()),
        config_update_interval: z.number(),
        script_file_name: z.string(),
        time_to_cash_out: z.null(),
      }),
    }),
    responses: {
      200: z.null(),
    },
    strictStatusCodes: true,
    summary: 'create script before creating humming bot',
  },
  startBot: {
    method: 'POST',
    path: '/start-bot',
    body: z.object({
      bot_name: z.string(),
      log_level: z.string(),
      script: z.string(),
      conf: z.string(),
      async_backend: z.boolean(),
    }),
    responses: {
      200: z.object({
        status: z.string(),
      }),
    },
    strictStatusCodes: true,
    summary: 'start bot',
  },

  stopBot: {
    method: 'POST',
    path: '/stop-bot',
    body: z.object({
      bot_name: z.string(),
      skip_order_cancellation: z.boolean(),
      async_backend: z.boolean(),
    }),
    responses: {
      200: z.object({
        status: z.string(),
      }),
    },
    strictStatusCodes: true,
    summary: 'stop bot',
  },
  getBotConfig: {
    method: 'GET',
    path: '/controller-config/:botId',
    pathParams: z.object({
      botId: z.string(),
    }),
    responses: {
      200: z.object({
        trading_pair: z.string(),
      }),
    },
    strictStatusCodes: true,
    summary: 'stop bot',
  },
});
