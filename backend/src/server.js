import express from 'express';
import dotenv from 'dotenv';
import datacoinRoute from './routes/datacoin.route.js';
import assets from './routes/assets.route.js';
import chat from './routes/geminiClient.route.js';
import marketscoin from './routes/marketscoin.route.js'
import python from './routes/python_sentiment.route.js'
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));

const __dirname = path.resolve()

app.use(express.json());

const port = process.env.PORT;

app.use("/api/datacoin", datacoinRoute);
app.use("/api/assets", assets);
app.use("/api/market", marketscoin);
app.use("/api/agent", chat);
app.use("/api/python-sentiment-service", python);


if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
    });
}
app.listen(port, () => {
    console.log(`Server is  running on http://localhost:${port}`);
});