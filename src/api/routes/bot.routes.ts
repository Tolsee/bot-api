import { initContract } from '@ts-rest/core';
import { z } from 'zod';

export const zPmmSimpleInput = z.object({
  id: z.string(),
  controller_name: z.literal('pmm_simple'),
  controller_type: z.literal('market_making'),
  manual_kill_switch: z.null(),
  candles_config: z.array(z.null()).max(0),
  connector_name: z.string(),
  trading_pair: z.string(),
  total_amount_quote: z.number(),
  buy_spreads: z.array(z.number()).min(1),
  sell_spreads: z.array(z.number()).min(1),
  buy_amounts_pct: z.array(z.number()).min(1),
  sell_amounts_pct: z.array(z.number()).min(1),
  executor_refresh_time: z.number(),
  cooldown_time: z.number(),
  leverage: z.number(),
  position_mode: z.union([z.literal('HEDGE'), z.literal('ONEWAY')]),
  stop_loss: z.number(),
  take_profit: z.number(),
  time_limit: z.number(),
  //TODO: What the heck is this?
  take_profit_order_type: z.number(),
  trailing_stop: z.object({
    activation_price: z.number(),
    trailing_delta: z.number(),
  }),
});

const zConfigReq = z.object({
  trading_pair: z.string(),
});

export const bot = {
  routes: initContract().router({
    createConfig: {
      method: 'POST',
      path: '/bot/config',
      body: zConfigReq,
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
  }),
};
