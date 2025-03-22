import express from 'express';
import cors from 'cors';
import http from "http";
import { connectDB } from './src/utilities/connectDB.js';
import { ALLOWED_ORIGIN, PORT } from './src/utilities/config.js';
import router from './src/route/router.js';

const app = express();

app.use(cors({
    origin: ALLOWED_ORIGIN,
    methods: 'GET,POST,PUT,DELETE',
    credentials: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", router);

const startServer = async () => {
    try {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}...`);
        })
        await connectDB()
    } catch (error) {

    }
}
startServer();
