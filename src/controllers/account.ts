import express from "express";
import axios from "axios";

import { authentication, random } from "../helpers/auth";
import { validatePassword } from "../helpers/validators";
import { IJWT } from "../helpers/JWT";
import { JWT } from "../helpers/variables";

export const getAccount = async (req: express.Request, res: express.Response) => {
    const token: IJWT = res.locals.token;
    const client = res.locals.client;

    try {
        if ("auth" in client.spotify) {
            const now = Math.floor(Date.now() / 1000);
            if (!client.spotify.favTracks.next_refresh || client.spotify.favTracks.next_refresh.getTime() <= now) {
                const cookie = req.cookies[JWT.COOKIE_NAME];
                const spotifyRes = await axios.get("http://localhost:5000/v2/spotify/fav-items", {
                    headers: {
                        Cookie: `${JWT.COOKIE_NAME}=${cookie}`,
                    },
                });

                if (spotifyRes.status === 200) {
                    client.spotify.favTracks = {
                        titles: spotifyRes.data,
                        next_refresh: new Date(new Date().setMonth(new Date().getMonth() + 1)), // Refresh every month
                    };

                    const updatedUser = await client.save();
                    if (!updatedUser) {
                        return res.status(500).json({ error: "Internal server error." });
                    }

                    return res.status(200).json(updatedUser);
                }
            }
        }
    } catch (error) {
        console.log("Error:", error);
    }

    return res.status(200).json(client);
};

export const changePassword = async (req: express.Request, res: express.Response) => {
    const token: IJWT = res.locals.token;
    const client = res.locals.client;

    const { oldPassword, newPassword, cNewPassword } = req.body;

    if (!oldPassword || !newPassword || !cNewPassword) {
        return res.status(400).json({ error: "Missing data in request." });
    }

    if (newPassword !== cNewPassword) {
        return res.status(400).json({ error: "The passwords are not the same." });
    }

    if (!validatePassword(newPassword)) {
        return res.status(400).json({ error: "Invalid password." });
    }

    const expectedHash = authentication(client.auth.salt, oldPassword);
    if (expectedHash !== client.auth.password) {
        return res.status(400).json({ error: "Invalid password." });
    }

    const salt = random({ size: 128 });
    client.auth.salt = salt;
    client.auth.password = authentication(salt, newPassword);

    const updatedClient = await client.save();
    if (!updatedClient) {
        return res.status(500).json({ error: "Internal server error." });
    }

    return res.status(200).json({ message: "Password changed successfully." });
};

export const addProductToCart = async (req: express.Request, res: express.Response) => {
    const token: IJWT = res.locals.token;
    const client = res.locals.client;

    const { id, quantity } = req.body;
    if (!id || !quantity) {
        return res.status(400).json({ error: "Missing data in request." });
    }

    const product = client.cart.find((p: { id: string, quantity: number }) => p.id === id);
    if (product) {
        product.quantity += quantity;
    } else {
        client.cart.push({ id, quantity });
    }

    const updatedClient = await client.save();
    if (!updatedClient) {
        return res.status(500).json({ error: "Internal server error." });
    }

    return res.status(200).json(updatedClient.cart);
};

export const updateProductInCart = async (req: express.Request, res: express.Response) => {
    const token: IJWT = res.locals.token;
    const client = res.locals.client;

    const { id, quantity } = req.body;
    if (!id || !quantity) {
        return res.status(400).json({ error: "Missing data in request." });
    }

    const product = client.cart.find((p: { id: string, quantity: number }) => p.id === id);
    if (!product) {
        return res.status(400).json({ error: "Product not found in cart." });
    }

    product.quantity = quantity;

    const updatedClient = await client.save();
    if (!updatedClient) {
        return res.status(500).json({ error: "Internal server error." });
    }

    return res.status(200).json(updatedClient.cart);
};

export const removeProductFromCart = async (req: express.Request, res: express.Response) => {
    const token: IJWT = res.locals.token;
    const client = res.locals.client;

    const { id } = req.query;
    if (!id) {
        return res.status(400).json({ error: "Missing data in request." });
    }

    const productIndex = client.cart.findIndex((p: { id: string, quantity: number }) => p.id === id);
    if (productIndex === -1) {
        return res.status(400).json({ error: "Product not found in cart." });
    }

    client.cart.splice(productIndex, 1);

    const updatedClient = await client.save();
    if (!updatedClient) {
        return res.status(500).json({ error: "Internal server error." });
    }

    return res.status(200).json(updatedClient.cart);
};
