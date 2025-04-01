import express from "express";
import cardsRouter from './routers/cards';
import socialRouter from './routers/socialLinks'
import { notFound } from "./middlewares/not-found";
import { errorHandler } from "./middlewares/error-handler";
import cors from 'cors';

const server = express();
server.use(cors());
server.use(express.json());

server.use('/api/cards', cardsRouter)
server.use('/api/social', socialRouter)

// special middleware for not found error
server.use(notFound)

// error middlewares
server.use(errorHandler)

export default server;
