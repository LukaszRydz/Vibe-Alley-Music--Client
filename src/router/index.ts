import express from 'express'

import auth from './auth'
import account from './account'
import spotify from './spotify'

export const initRouter = (app: express.Application) => {
    const router = express.Router()

    auth(router)
    account(router)
    spotify(router)
    
    app.use(`/`, router)
}
