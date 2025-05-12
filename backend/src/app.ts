import express from "express";
import cardsRouter from './routers/cards';
import socialRouter from './routers/socialLinks'
import authRouter from './routers/auth'
import appsRouter from './routers/appointments'
import contactRouter from './routers/contact'
import { notFound } from "./middlewares/not-found";
import { errorHandler } from "./middlewares/error-handler";
import cors from 'cors';
import stripTags from "./middlewares/strip-tags";
import authentication from "./middlewares/authentication";
import expressFileUpload from 'express-fileupload';
import path from "path";
import config from "config";

const server = express();
server.use(cors());
server.use(express.json());
server.use(expressFileUpload({
    useTempFiles: true,
    tempFileDir: path.resolve(__dirname, 'SavedImages'),
})); server.use(authentication);
server.use(stripTags);

server.use('/api', authRouter)
server.use('/api/cards', cardsRouter)
server.use('/api/social', socialRouter)
server.use('/api/apps', appsRouter)
server.use('/images', express.static(path.resolve(config.get<string>('app.images.path'))))
server.use('/api/contact', contactRouter)

server.use(notFound)

server.use(errorHandler)

export default server;
