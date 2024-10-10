import express from 'express';

import { register, login, verify, logout } from '../controllers/auth';
import { verifyJWT } from '../middlewares/JWT';
import { isAuthorized } from '../middlewares/auth';

export default (router: express.Router) => {
    router.post('/auth/register', register);
    router.post('/auth/login', login);
    router.get('/auth/logout', verifyJWT, isAuthorized, logout);

    router.post('/auth/verify', verifyJWT, verify);
}