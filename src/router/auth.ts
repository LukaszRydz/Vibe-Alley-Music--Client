import express from "express";

import { register, login, verify, logout, oneTimeLogin } from "../controllers/auth";
import { verifyJWT } from "../middlewares/JWT";
import { getClient } from "../middlewares/client";
import { email_oneTimeKey } from "../controllers/email";
import { ipLimiter } from "../middlewares/ipLimiter";

export default (router: express.Router) => {
    router.post("/auth/register", register);
    router.post("/auth/login", login);
    router.get("/auth/logout", logout);

    router.post("/auth/one-time-login-key", ipLimiter(
        3, 5 * 60 * 1000, 
        "Sorry, you have reached the maximum number of key requests. Please wait 5 minutes to try again."), 
        email_oneTimeKey);
    router.post("/auth/one-time-login", oneTimeLogin);

    router.post("/auth/verify", verifyJWT, getClient, verify);
};
