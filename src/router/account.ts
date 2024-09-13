import express from 'express';

import { changePassword } from '../controllers/account';

import { verifyJWT } from '../middlewares/verifyJWT';
import { isAuthorized } from '../middlewares/auth';

export default (router: express.Router) => {
    router.patch('/account/change-password', verifyJWT, isAuthorized, changePassword);
    // TODO: delete account route, first we need to implement orders and payments
}