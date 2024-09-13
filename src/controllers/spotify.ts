import { getClientBySessionTokenAndId } from './../database/Schemas/Client';
import express from 'express';

import { IJWT } from '../helpers/JWT';

export const saveSpotifyToken = async (req: express.Request, res: express.Response) => {
    const token: IJWT = res.locals.token;

    const client = await getClientBySessionTokenAndId(token.sessionToken, token.id)
    if (!client) {
        return res.status(400).json({ error: "Client not found!" })
    }

    client.spotify.auth = res.locals.token.spotifyToken
    const savedClient = await client.save()
    if (!savedClient) {
        return res.status(500).json({ error: "Internal Server Error!" })
    }

    return res.status(200).json({message: "Token saved successfully."})
}