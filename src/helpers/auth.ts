import crypto from 'crypto';
import { Api } from './variables';

// Function to generate a random string
export const random = ({ size=128 }:{ size?: number }) => crypto.randomBytes(size).toString('base64');

// Function to hash the password
export const authentication = (salt: string, password: string) => {
    return crypto.createHmac('sha256', [salt, password].join('/')).update(Api.PASSWORD_SECRET).digest('hex');
}

// Function to create a session token
export const createSessionToken = (uid: string) => {
    const salt = random({size: 128});
    const sessionToken = authentication(salt, uid)

    return sessionToken
}