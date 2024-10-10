import express from 'express';

import { isAuthorized } from '../middlewares/auth';
import { verifyJWT } from '../middlewares/JWT';
import { disconnectSpotify, saveSpotifyToken } from '../controllers/spotify';

export default (router: express.Router) => {
    router.get('/spotify/save-token', verifyJWT, isAuthorized, saveSpotifyToken);
    router.delete('/spotify/disconnect', verifyJWT, isAuthorized, disconnectSpotify);
}