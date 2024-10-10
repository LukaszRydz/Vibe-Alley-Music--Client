import express from 'express';
import { deleteJWTCookie, IJWT } from '../helpers/JWT';

import { getClientBySessionTokenAndId } from '../database/Schemas/Client';

export const getClient = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token: IJWT = res.locals.token;
    
    return getClientBySessionTokenAndId(token.sessionToken, token.id).then((client) => {
        if (!client) {
            deleteJWTCookie(res);
            return res.status(401).json({error: "Client not found!"})
        }
    
        res.locals.client = client;
        next();
    }).catch((error) => {
        deleteJWTCookie(res);
        return res.status(500).json({error: "Internal Server Error."})
    });
}