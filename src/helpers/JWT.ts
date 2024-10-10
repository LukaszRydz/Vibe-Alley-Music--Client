import express from 'express';
import jwt from 'jsonwebtoken';

import { JWT, Api } from './variables';

export const generateJWTCookie = (res: express.Response, payload: object) => {
    const token = jwt.sign(payload, JWT.SECRET, { expiresIn: JWT.EXPIRES_IN, algorithm: JWT.ALGORITHM as jwt.Algorithm });
    
    res.cookie(JWT.COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        expires: new Date(Date.now() + Number(JWT.EXPIRES_IN.replace('d', '')) * 24 * 60 * 60 * 1000),
    });
}

export const deleteJWTCookie = (res: express.Response) => {
    res.clearCookie(JWT.COOKIE_NAME);
}

export interface IJWT {
    [x: string]: {};
    token: {};
    sessionToken: string;
    id: string;
    role: string;
    spotifyToken: {
        access_token: string;
        refresh_token: string;
        next_refresh: number;
        scope: string;
    } | null;
}