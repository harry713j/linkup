import "dotenv/config";

const PORT = process.env.PORT as string;
const ALLOWED_CLIENT = process.env.ALLOWED_ORIGIN as string;
const DATABASE_URL = process.env.DB as string;

export { PORT, ALLOWED_CLIENT, DATABASE_URL };
