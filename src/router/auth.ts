import express from 'express';

import { register, login, verify, logout } from '../controllers/auth';
import { verifyJWT } from '../middlewares/JWT';
import { getClient } from '../middlewares/client';

export default (router: express.Router) => {
    router.post('/auth/register', register);
    router.post('/auth/login', login);
    router.get('/auth/logout', logout);

    router.post('/auth/verify', verifyJWT,  getClient,verify);
}