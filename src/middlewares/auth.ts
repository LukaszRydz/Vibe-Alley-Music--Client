import express from 'express';

import { getClientBySessionTokenAndId } from '../database/Schemas/Client';

import { IJWT } from '../helpers/JWT';

export const isAuthorized = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        // ! Remember before using this middleware, you need to use verifyJWT middleware first!
        const token: IJWT = res.locals.token;

        if (!token) {
            return res.status(401).json({error: "Token not found!"})
        }
    
        if (!token.sessionToken || !token.id) {
            return res.status(401).json({error: "Invalid token."})
        }
    
        const client = await getClientBySessionTokenAndId(token.sessionToken, token.id);
        if (!client) {
            return res.status(401).json({error: "Client not found!"})
        }
    
        if (token.role !== "client") {
            return res.status(401).json({error: "Invalid role!"})
        }

        if (token.role !== client.role) {
            return res.status(401).json({error: "Invalid role!"})
        }

        next();
    } catch (error) {
        return res.status(500).json({error: "Internal Server Error."})
    }
}