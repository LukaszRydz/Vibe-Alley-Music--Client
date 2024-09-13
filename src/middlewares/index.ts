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

// Global middlewares
export const initMiddlewares = (app: express.Application) => {
    app.use(helmet())
    app.use(cors({ credentials: true, }))
    app.use(bodyParser.json())
    app.use(cookieParser())
    app.use(compression())
    app.use(logRequest)
}    