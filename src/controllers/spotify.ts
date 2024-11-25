import { ClientModel, getClientBySessionTokenAndId } from './../database/Schemas/Client';
import express from 'express';

import { generateJWTCookie, IJWT } from '../helpers/JWT';
import { Host } from '../helpers/variables';

export const saveSpotifyToken = async (req: express.Request, res: express.Response) => {
    const token: IJWT = res.locals.token;
    const client = res.locals.client;

    client.spotify.auth = res.locals.token.spotifyToken
    const savedClient = await client.save()
    if (!savedClient) {
        return res.status(500).json({ error: "Internal Server Error!" })
    }

    return res.status(200).redirect(Host.FRONT)
}

export const disconnectSpotify = async (req: express.Request, res: express.Response) => {
    const token: IJWT = res.locals.token;
    const client = res.locals.client;

    try {
        const updateResult = await ClientModel.findByIdAndUpdate(
            client._id,
            { $unset: { spotify: "" } },
            { new: true }
        );

        if (!updateResult) {
            return res.status(500).json({error: "Failed to update client."});
        }
    } catch (error) {
        console.log('Error during update:', error);
        return res.status(500).json({error: "Internal server error."});
    }

    const updatedClient = await getClientBySessionTokenAndId(token.sessionToken, token.id);
    if (!updatedClient) {
        return res.status(500).json({error: "Internal server error."});
    }

    delete token.spotifyToken;
    delete (token as any).exp;

    generateJWTCookie(res, token);
    return res.status(200).json(updatedClient);
}