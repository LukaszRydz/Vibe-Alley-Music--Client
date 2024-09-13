import express from 'express';
import jwt from 'jsonwebtoken';

import { JWT, Api } from './variables';

export const generateJWTCookie = (res: express.Response, payload: object) => {
    const token = jwt.sign(payload, JWT.SECRET, { expiresIn: JWT.EXPIRES_IN, algorithm: JWT.ALGORITHM as jwt.Algorithm });

    res.cookie(JWT.COOKIE_NAME, token, {
        // domain: Api.HOST,
        httpOnly: true,
    });
}

export interface IJWT {
    sessionToken: string;
    id: string;
    role: string;
    spotifyToken: {
        access_token: string;
        refresh_token: string;
        next_refresh: number;
        scope: string;
    }
}