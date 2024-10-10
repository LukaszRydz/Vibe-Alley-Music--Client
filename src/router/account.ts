import express from 'express';

import { addProductToCart, changePassword, getAccount, removeProductFromCart, updateProductInCart } from '../controllers/account';

import { verifyJWT } from '../middlewares/verifyJWT';
import { isAuthorized } from '../middlewares/auth';

export default (router: express.Router) => {
    router.get('/account', verifyJWT, getAccount);
    router.patch('/account/change-password', verifyJWT, isAuthorized, changePassword);

    // add to cart
    router.post('/account/add-to-cart', verifyJWT, isAuthorized, addProductToCart);
    router.patch('/account/update-cart', verifyJWT, isAuthorized, updateProductInCart);
    router.delete('/account/remove-from-cart', verifyJWT, isAuthorized, removeProductFromCart);

    // TODO: delete account route, first we need to implement orders and payments
}