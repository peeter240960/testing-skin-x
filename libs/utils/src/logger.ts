import { config } from 'dotenv';
import pino from 'pino';
import pretty from 'pino-pretty';

config();

export const logger = pino(pretty({ colorize: true, ignore: 'pid,hostname' }));
