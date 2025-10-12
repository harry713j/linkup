import { httpServer } from "./app.js";
import { PORT } from "./constants.js";
import { io } from "./app.js";

httpServer.listen(PORT, () => {
  console.log("🚀 Server started on PORT ", PORT);
});
