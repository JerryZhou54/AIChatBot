import express from 'express';
import {config} from "dotenv";
import morgan from "morgan";
import appRouter from './routes/index.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { BASE_DOMAIN } from './utils/constants.js';
config();
const app = express();

app.use(cors({ origin: BASE_DOMAIN, credentials: true}));
// Define a middleware
// The incoming and outgoing data will be passed to JSON
app.use(express.json());

app.use(cookieParser(process.env.COOKIE_SECRET));

// Remove in production
app.use(morgan("dev"));

app.use("/api/v1", appRouter);

export default app;