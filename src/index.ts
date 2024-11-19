import express from 'express';
import http from 'http'

import { initMiddlewares } from './middlewares';
import { initRouter } from './router';
import { initDatabase } from './database';

import { Api } from './helpers/variables';

const app = express();

initMiddlewares(app);
initRouter(app);
initDatabase()

const server = http.createServer(app);

server.listen(Api.PORT, () => {
    console.log(`Server is running on port ${Api.PORT} ✔`);
});