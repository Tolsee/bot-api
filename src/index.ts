import * as dotenv from 'dotenv';
dotenv.config();

import { createExpressEndpoints, initServer } from '@ts-rest/express';
import bodyParser from 'body-parser';
import express from 'express';
import { randomUUID } from 'crypto';
import * as swaggerUi from 'swagger-ui-express';

import { API } from './api/contract';
import hummingbotClient from './hummingbot-api/client';
import logger from './lib/logger';
import { openApiDocument } from './lib/open-api';
import { getUUID } from './lib/get-uuid';
import { authMiddleware } from './api/middlewares/auth.middleware';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
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
      middleware: [authMiddleware],
      handler: async (req) => {
        const { trading_pair } = req.body;
        const controllerName = randomUUID();
        const response = await hummingbotClient.addControllerConfig({
          body: {
            name: controllerName,
            content: {
              id: controllerName,
              controller_name: 'pmm_simple',
              controller_type: 'market_making',
              manual_kill_switch: null,
              candles_config: [],
              connector_name: 'binance',
              trading_pair,
              total_amount_quote: 15,
              buy_spreads: [0.005],
              sell_spreads: [0.005],
              buy_amounts_pct: [0.4],
              sell_amounts_pct: [0.4],
              executor_refresh_time: 30,
              cooldown_time: 3600,
              leverage: 1,
              position_mode: 'HEDGE',
              stop_loss: 0.05,
              take_profit: 0.02,
              time_limit: 43200,
              take_profit_order_type: 2,
              trailing_stop: {
                activation_price: 0.018,
                trailing_delta: 0.01,
              },
            },
          },
        });
        logger.info({ message: 'response', payload: response });

        const createScriptResponse = await hummingbotClient.createScript({
          body: {
            name: controllerName,
            content: {
              markets: {},
              candles_config: [],
              controllers_config: [controllerName + '.yml'],
              config_update_interval: 10,
              script_file_name: 'v2_with_controllers.py',
              time_to_cash_out: null,
            },
          },
        });

        logger.info({
          mesage: 'after create script response',
          payload: createScriptResponse,
        });

        const createBotResponse = await hummingbotClient.createBot({
          body: {
            instance_name: controllerName,
            credentials_profile: 'master_account',
            image: 'hummingbot/hummingbot:latest',
            script: 'v2_with_controllers.py',
            script_config: controllerName + '.yml',
          },
        });
        logger.info({
          mesage: 'create bot response',
          payload: createBotResponse,
        });

        return {
          status: 200,
          body: null,
        };
      },
    },
    listBots: {
      middleware: [authMiddleware],
      handler: async () => {
        const response = await hummingbotClient.listBots();
        logger.info({ message: 'response from list bots', payload: response });

        return {
          status: 200,
          body: {
            data: response.body.data,
          },
        };
      },
    },
    startBot: {
      middleware: [authMiddleware],
      handler: async (req) => {
        const { bot_name } = req.body;
        const botUUID = getUUID(bot_name);
        const response = await hummingbotClient.startBot({
          body: {
            bot_name: bot_name,
            log_level: '2',
            script: 'v2_with_controllers.py',
            conf: botUUID + '.yml',
            async_backend: false,
          },
        });

        logger.info({
          message: 'response from start bot: ',
          payload: response,
        });

        return {
          status: 200,
          body: null,
        };
      },
    },
    stopBot: {
      middleware: [authMiddleware],
      handler: async (req) => {
        const { bot_name } = req.body;
        const response = await hummingbotClient.stopBot({
          body: {
            bot_name: bot_name,
            skip_order_cancellation: false,
            async_backend: false,
          },
        });

        logger.info({ message: 'response from stop bot: ', payload: response });

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
