import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";

import router from "./router";
import { connectDB } from "./config/db";
import { requestLogger } from "./middlewares/logger";
import { errorHandler } from "./middlewares/error.middleware";
import logger from "./utils/logger";

dotenv.config();
connectDB();

const app = express();

// Built-in JSON parser (modern Express)
app.use(express.json());
app.use(cors({ credentials: true }));
app.use(compression());
app.use(cookieParser());

// Dev request logging
app.use(requestLogger);

// Mount API routes
app.use("/", router());

// Error handler (must be after routes)
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
const server = http.createServer(app);

server.listen(Number(PORT), () => {
  logger.info({ port: PORT }, `Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  logger.info("SIGINT received: closing HTTP server");
  server.close(() => {
    logger.info("HTTP server closed");
    process.exit(0);
  });
});
