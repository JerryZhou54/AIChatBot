import express from 'express';
import {config} from "dotenv";
import morgan from "morgan";
import appRouter from './routes/index.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import fileUpload from 'express-fileupload';
config();
const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true}));
app.use(fileUpload());
// Define a middleware
// The incoming and outgoing data will be passed to JSON
app.use(express.json());

app.use(cookieParser(process.env.COOKIE_SECRET));

// Remove in production
app.use(morgan("dev"));

app.use("/api/v1", appRouter);

export default app;