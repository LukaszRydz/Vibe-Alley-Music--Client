import express from 'express';
import { deleteJWTCookie, IJWT } from '../helpers/JWT';
import { getClientBySessionTokenAndId } from '../database/Schemas/Client';


export const isAuthorized = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const token: IJWT = res.locals.token;
        let client = res.locals.client;

        if (!client) {
            client = await getClientBySessionTokenAndId(token.sessionToken, token.id);
            if (!client) {
                deleteJWTCookie(res);
                return res.status(401).json({ error: "Client not found!" });
            }
        }

        if (token.role !== "client" || token.role !== client.role) {
            deleteJWTCookie(res);
            return res.status(401).json({ error: "Invalid role!" });
        }

        next();
    } catch (error) {
        deleteJWTCookie(res);
        return res.status(500).json({ error: "Internal Server Error." });
    }
}