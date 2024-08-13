import pino from 'pino';

const usePinoPretty =
  process.env.EOS_ENVIRONMENT === 'development' &&
  process.env.EOS_DD_ENABLED !== 'true';

const logger = pino({
  messageKey: 'message',
  ...(usePinoPretty && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  }),
  ...(!usePinoPretty && {
    formatters: {
      level: (label) => ({ level: label }),
    },
  }),
});

export default logger;
