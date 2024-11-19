import express from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

import { deleteJWTCookie } from "../helpers/JWT";
import { JWT } from "../helpers/variables";

export const verifyJWT = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token = req.cookies[JWT.COOKIE_NAME];

    const now = Math.floor(Date.now() / 1000);

    try {
        const tokenInfo = jwt.decode(token) as JwtPayload;
        if (!tokenInfo?.exp || !tokenInfo?.iat || !tokenInfo?.sessionToken || !tokenInfo?.id || !tokenInfo?.role) {
            deleteJWTCookie(res);
            return res.status(401).json({ error: "Invalid token" });
        }

        if (tokenInfo.exp <= now) {
            deleteJWTCookie(res);
            return res.status(401).json({ error: "Token expired" });
        }

        const decoded = jwt.verify(token, JWT.SECRET);
        if (!decoded) {
            deleteJWTCookie(res);
            return res.status(401).json({ error: "Unauthorized" });
        }

        res.locals.token = decoded;
        next();
    } catch (error) {
        deleteJWTCookie(res);
        return res.status(401).json({ error: "Unauthorized" });
    }
};
