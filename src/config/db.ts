import mongoose from "mongoose";
import logger from "../utils/logger";

// Establish connection to MongoDB. Expects `MONGO_URL` to be defined in env.
export const connectDB = async () => {
  const mongoUrl = process.env.MONGO_URL;
  if (!mongoUrl) {
    logger.error("MONGO_URL environment variable is not set");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUrl);
    logger.info("DB connected");
  } catch (error) {
    logger.error({ err: error }, "Failed to connect to DB");
    process.exit(1);
  }
};

export const disconnectDB = async () => mongoose.disconnect();
