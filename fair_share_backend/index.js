import express from 'express';
import cors from 'cors';
import http from "http";
// import { Server } from "socket.io";
import { connectDB } from './src/utilities/connectDB.js';
import { ALLOWED_ORIGIN, PORT } from './src/utilities/config.js';
import router from './src/route/router.js';

const app = express();
// const server = http.createServer(app);

// const io = new Server(server, {
//     cors: {
//         origin: ALLOWED_ORIGIN,
//         methods: ["GET", "POST"],
//         credentials: true,
//     },
//     path: "/socket.io",
//     transports: ["websocket", "polling"],
// });

app.use(cors({
    origin: ALLOWED_ORIGIN,
    methods: 'GET,POST,PUT,DELETE',
    credentials: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", router);

// io.on("connection", (socket) => {
//     console.log("A User Connected:", socket.id);

//     socket.on("sendMessage", (message) => {
//         console.log("message:", message);
//         io.emit("receiveMessage", message);
//     });

//     socket.on("disconnect", () => {
//         console.log("user disconnected:", socket.id);
//     });
// });

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
