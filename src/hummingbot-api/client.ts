import { API } from './contract';
import { initClient } from '@ts-rest/core';

const VALIDATE_RESPONSE = true;

export const HUMMINGBOT_BASE_URL = process.env.HUMMINGBOT_BASE_URL || '';
if (HUMMINGBOT_BASE_URL === '') throw new Error('No HUMMINGBOT base URL');

const client = initClient(API, {
  baseUrl: HUMMINGBOT_BASE_URL,
  baseHeaders: {},
  validateResponse: VALIDATE_RESPONSE,
});

export default client;
