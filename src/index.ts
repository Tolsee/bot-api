import * as dotenv from 'dotenv';
dotenv.config();

import { createExpressEndpoints, initServer } from '@ts-rest/express';
import bodyParser from 'body-parser';
import express from 'express';
import { randomUUID } from 'crypto';
import * as swaggerUi from 'swagger-ui-express';

import { API } from './api/contract';
import hummingbotClient from './hummingbot-api/client';
import { authMiddleware } from './api/middlewares/auth.middleware';
import logger from './lib/logger';
import { openApiDocument } from './lib/open-api';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
console.log(openApiDocument);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

const s = initServer();

const router = s.router(API, {
  System: {
    getHealthCheck: async () => {
      return {
        status: 200,
        body: {
          status: 'OK',
        },
      };
    },
  },
  Bot: {
    createConfig: {
      // middleware: [authMiddleware],
      handler: async (req) => {
        logger.info({ message: 'create config', payload: req.body });

        const { trading_pair } = req.body;
        const response = await hummingbotClient.addControllerConfig({
          body: {
            name: randomUUID(),
            content: {
              id: randomUUID(),
              controller_name: 'pmm_simple',
              controller_type: 'market_making',
              manual_kill_switch: null,
              candles_config: [],
              connector_name: 'binance',
              trading_pair,
              total_amount_quote: 100,
              buy_spreads: [0.01],
              sell_spreads: [0.01],
              buy_amounts_pct: [0.5],
              sell_amounts_pct: [0.5],
              executor_refresh_time: 30,
              cooldown_time: 30,
              leverage: 1,
              position_mode: 'HEDGE',
              stop_loss: 0.01,
              take_profit: 0.01,
              time_limit: 60,
              take_profit_order_type: 1,
              trailing_stop: {
                activation_price: 0.01,
                trailing_delta: 0.01,
              },
            },
          },
        });

        logger.info({ message: 'response', payload: response });

        return {
          status: 200,
          body: null,
        };
      },
    },
  },
});

createExpressEndpoints(API, router, app);

app.listen(9000, () => {
  console.log('Listening on port 9000');
});
