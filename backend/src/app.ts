import express from 'express';
import {config} from "dotenv";
import morgan from "morgan";
import appRouter from './routes/index.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
config();
const app = express();

//app.use(cors({ origin: "http://localhost:5173", credentials: true}));
//app.use(cors({ origin: "https://frontend-jhtu.onrender.com", credentials: true}));
app.use(cors({ origin: "https://aichatbot-bca0d.firebaseapp.com", credentials: true}));
// Define a middleware
// The incoming and outgoing data will be passed to JSON
app.use(express.json());

app.use(cookieParser(process.env.COOKIE_SECRET));

// Remove in production
app.use(morgan("dev"));

app.use("/api/v1", appRouter);

export default app;