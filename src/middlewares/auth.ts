import express from 'express';
import { IJWT } from '../helpers/JWT';
import { getClientBySessionTokenAndId } from '../database/Schemas/Client';


export const isAuthorized = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        // ! Remember before using this middleware, you need to use verifyJWT middleware first!
        const token: IJWT = res.locals.token;
        const client = res.locals.client;

        if (!client) {
            const client = await getClientBySessionTokenAndId(token.sessionToken, token.id);
            if (!client) {
                return res.status(401).json({error: "Client not found!"})
            }

            if (token.role !== "client" || token.role !== client.role) {
                return res.status(401).json({error: "Invalid role!"})
            }            
        } else {   
            if (token.role !== "client" || token.role !== client.role) {
                return res.status(401).json({error: "Invalid role!"})
            }
        }

        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: "Internal Server Error."})
    }
}