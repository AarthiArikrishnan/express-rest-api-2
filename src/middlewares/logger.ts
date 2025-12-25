import pinoHttp from "pino-http";
import logger from "../utils/logger";

// pino-http returns an express middleware that attaches `req.log` and logs requests
export const requestLogger = pinoHttp({ logger });
