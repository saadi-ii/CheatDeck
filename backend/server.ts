import app from "./src/app.js";
import { env } from "./src/config/env.js";
import { connectDB } from "./src/db/db.js";

await connectDB();

app.listen(env.PORT, () => {
  console.log(`API running on http://localhost:${env.PORT}`);
});
