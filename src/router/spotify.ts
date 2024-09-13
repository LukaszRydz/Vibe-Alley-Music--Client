import express from 'express';

import { isAuthorized } from '../middlewares/auth';
import { verifyJWT } from '../middlewares/verifyJWT';
import { saveSpotifyToken } from '../controllers/spotify';

export default (router: express.Router) => {
    router.get('/spotify/save-token', verifyJWT, isAuthorized, saveSpotifyToken);
}