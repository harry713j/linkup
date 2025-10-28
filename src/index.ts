import { httpServer } from "./app.js";
import { config } from "./config/config.js";
import logger from "@/logging/logger.js";

const PORT = config.port;
httpServer.listen(PORT, () => {
  logger.info("🚀 Server started on PORT " + PORT);
});
