import express from 'express';

import { register, login, verify } from '../controllers/auth';
import { verifyJWT } from '../middlewares/verifyJWT';

export default (router: express.Router) => {
    router.post('/auth/register', register);
    router.post('/auth/login', login);

    router.post('/auth/verify', verifyJWT, verify);
}