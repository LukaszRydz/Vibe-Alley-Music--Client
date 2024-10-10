import express from 'express'

import helmet from "helmet";
import cors from 'cors'
import bodyParser from 'body-parser'
import compression from 'compression'
import cookieParser from 'cookie-parser'

const logRequest = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(`${req.method} ${req.path}`)
    next()
}

const customHeaders = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.header('Access-Control-Expose-Headers', 'music-store-cookie_deleted');
    next()
}

const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:8050'];

// Global middlewares
export const initMiddlewares = (app: express.Application) => {
    app.use(customHeaders)
    app.use(helmet())
    app.use(cors({ 
        credentials: true,
        origin: allowedOrigins
    }))
    app.use(bodyParser.json())
    app.use(cookieParser())
    app.use(compression())
    app.use(logRequest)
}