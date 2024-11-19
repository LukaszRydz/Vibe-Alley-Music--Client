import { getClient } from './../middlewares/client';
import express from 'express';

import { addProductsToCart, changePassword, getAccount, removeProductFromCart, updateProductInCart } from '../controllers/account';

import { verifyJWT } from '../middlewares/JWT';
import { isAuthorized } from '../middlewares/auth';

export default (router: express.Router) => {
    router.get('/account', verifyJWT, getClient, getAccount);
    router.patch('/account/change-password', verifyJWT, getClient, isAuthorized, changePassword);

    // add to cart
    router.post('/account/add-to-cart', verifyJWT, getClient, isAuthorized, addProductsToCart);
    router.patch('/account/update-cart', verifyJWT, getClient, isAuthorized, updateProductInCart);
    router.delete('/account/remove-from-cart', verifyJWT, getClient, isAuthorized, removeProductFromCart);
}