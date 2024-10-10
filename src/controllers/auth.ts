import express from 'express'

import { existsByEmail, createClient, getClientByEmail, getClientBySessionTokenAndId } from '../database/Schemas/Client'

import { validatePassword, emailValidator } from '../helpers/validators'
import { authentication, random } from '../helpers/auth'
import { deleteJWTCookie, generateJWTCookie, IJWT } from '../helpers/JWT'

export const register = async (req: express.Request, res: express.Response) => {
    const { email, password, cpassword } : IRegister = req.body

    if (!email || !password || !cpassword) {
        return res.status(400).json({ error: "Please fill all fields!" })
    }

    if (!validatePassword(password, cpassword)) {
        return res.status(400).json({ error: "Password doesn't meet the requirements!" })
    }

    if (!emailValidator(email)) {
        return res.status(400).json({ error: "Email is invalid!" })
    }

    if (await existsByEmail(email)) {
        return res.status(400).json({ error: "Email already exists!" })
    }

    const salt = random({ size: 128 })
    try {
        const client = await createClient({
            email,
            auth: {
                salt,
                password: authentication(salt, password),
            }
        })

        if (!client) {
            return res.status(500).json({ error: "Internal Server Error!" })
        }

        res.status(201).json(client).end()
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const login = async (req: express.Request, res: express.Response) => {
    const { email, password } : ILogin = req.body

    console.log(email, password);
    if (!email || !password) {
        return res.status(400).json({ error: "Please fill all fields!" })
    }

    if (!emailValidator(email)) {
        return res.status(400).json({ error: "Email is invalid!" })
    }

    const client = await getClientByEmail(email).select('+auth.salt +auth.password')
    if (!client) {
        return res.status(400).json({ error: "Client not found!" })
    }

    const expectedHash = authentication(client.auth.salt, password);
    if (client.auth.password !== expectedHash) {
        return res.status(400).json({ error: "Invalid password!" })
    }

    const salt = random({ size: 128 })
    client.auth.sessionToken = authentication(salt, client._id.toString())

    const savedClient = await client.save()
    if (!savedClient) {
        return res.status(500).json({ error: "Internal Server Error!" })
    }

    const payload = {
        sessionToken: savedClient.auth.sessionToken,
        id: savedClient._id.toString(),
        role: savedClient.role,
        spotifyToken: savedClient.spotify.auth || {}
    }

    generateJWTCookie(res, payload)
    
    res.status(200).json(savedClient).end()
}

export const logout = async (req: express.Request, res: express.Response) => {
    const token: IJWT = res.locals.token;

    const client = await getClientBySessionTokenAndId(token.sessionToken, token.id)
    if (!client) {
        return res.status(400).json({ error: "Client not found!" })
    }

    deleteJWTCookie(res)
    return res.status(200).json({ message: "Logged out successfully!" })
}

export const verify = async (req: express.Request, res: express.Response) => {
    const token: IJWT = res.locals.token;

    
    if (!token) {
        return res.status(400).json({ error: "Token is required!" })
    }
    
    if (!token.sessionToken || !token.id) {
        return res.status(400).json({ error: "Invalid token!" })
    }
    
    if (token.role !== "client") {
        return res.status(400).json({ error: "Unauthorized!" })
    }
    
    const client = await getClientBySessionTokenAndId(token.sessionToken, token.id)
    if (!client) {
        return res.status(400).json({ error: "Client not found!" })
    }
    
    if ('spotifyToken' in token && token.spotifyToken.access_token) {
        if (token.spotifyToken.access_token !== client.spotify.auth.access_token) {
            return res.status(400).json({ error: "Invalid spotify token!" })
        }
    }
    
    return res.sendStatus(200).end()
}

interface ILogin {
    email: string;
    password: string;
}

interface IRegister {
    email: string;
    password: string;
    cpassword: string;
}