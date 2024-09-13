import express from 'express';

import { getClientBySessionTokenAndId } from '../database/Schemas/Client';

import { authentication, random } from '../helpers/auth';
import { validatePassword } from '../helpers/validators';
import { IJWT } from '../helpers/JWT';

export const changePassword = async (req: express.Request, res: express.Response) => {
    const token: IJWT = res.locals.token;
    if (!token) {
        return res.status(401).json({error: "Unauthorized."})
    }
    
    const { oldPassword, newPassword, cNewPassword } = req.body;
    
    if (!oldPassword || !newPassword || !cNewPassword) {
        return res.status(400).json({error: "Missing data in request."})
    }

    if (newPassword !== cNewPassword) {
        return res.status(400).json({error: "The passwords are not the same."})
    }

    if (!validatePassword(newPassword)) {
        return res.status(400).json({error: "Invalid password."})
    }

    const client = await getClientBySessionTokenAndId(token.sessionToken, token.id).select('+auth.salt +auth.password');
    if (!client) {
        return res.status(400).json({error: "Client not found."})
    }

    const expectedHash = authentication(client.auth.salt, oldPassword);
    if (expectedHash !== client.auth.password) {
        return res.status(400).json({error: "Invalid password."})
    }

    const salt = random({ size: 128 })
    client.auth.salt = salt;
    client.auth.password = authentication(salt, newPassword);

    const updatedClient = await client.save();
    if (!updatedClient) {
        return res.status(500).json({error: "Internal server error."})
    }

    return res.status(200).json({message: "Password changed successfully."})
}