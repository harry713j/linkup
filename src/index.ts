import { httpServer } from "./app.js";
import { config } from "./config/config.js";

const PORT = config.port;
httpServer.listen(PORT, () => {
  console.log("🚀 Server started on PORT ", PORT);
});
