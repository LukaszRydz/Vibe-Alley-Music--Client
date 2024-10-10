import express from "express";
import axios from "axios";

import { getClientBySessionTokenAndId } from "../database/Schemas/Client";

import { authentication, random } from "../helpers/auth";
import { validatePassword } from "../helpers/validators";
import { IJWT } from "../helpers/JWT";
import { JWT } from "../helpers/variables";

export const getAccount = async (req: express.Request, res: express.Response) => {
    const token: IJWT = res.locals.token;

    try {
        const user = await getClientBySessionTokenAndId(token.sessionToken, token.id);
        if (!user) {
            return res.status(400).json({ error: "User not found." });
        }

        try {
            if ("auth" in user.spotify) {
                const now = Math.floor(Date.now() / 1000);
                if (!user.spotify.favTracks.next_refresh || user.spotify.favTracks.next_refresh.getTime() <= now) {
                    const cookie = req.cookies[JWT.COOKIE_NAME];
                    const spotifyRes = await axios.get("http://localhost:5000/v2/spotify/fav-items", {
                        headers: {
                            Cookie: `${JWT.COOKIE_NAME}=${cookie}`,
                        },
                    });

                    if (spotifyRes.status === 200) {
                        user.spotify.favTracks = {
                            titles: spotifyRes.data,
                            next_refresh: new Date(new Date().setMonth(new Date().getMonth() + 1)) // Refresh every month
                        };

                        const updatedUser = await user.save();
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

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ error: "Internal server error." });
    }
};

export const changePassword = async (req: express.Request, res: express.Response) => {
    const token: IJWT = res.locals.token;

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

    const client = await getClientBySessionTokenAndId(token.sessionToken, token.id).select("+auth.salt +auth.password");
    if (!client) {
        return res.status(400).json({ error: "Client not found." });
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

    const { id, quantity } = req.body;
    if (!id || !quantity) {
        return res.status(400).json({ error: "Missing data in request." });
    }

    const client = await getClientBySessionTokenAndId(token.sessionToken, token.id);
    if (!client) {
        return res.status(400).json({ error: "Client not found." });
    }

    const product = client.cart.find((p) => p.id === id);
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

    const { id, quantity } = req.body;
    if (!id || !quantity) {
        return res.status(400).json({ error: "Missing data in request." });
    }

    const client = await getClientBySessionTokenAndId(token.sessionToken, token.id);
    if (!client) {
        return res.status(400).json({ error: "Client not found." });
    }

    const product = client.cart.find((p) => p.id === id);
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

    const { id } = req.query;
    if (!id) {
        return res.status(400).json({ error: "Missing data in request." });
    }

    const client = await getClientBySessionTokenAndId(token.sessionToken, token.id);
    if (!client) {
        return res.status(400).json({ error: "Client not found." });
    }

    const productIndex = client.cart.findIndex((p) => p.id === id);
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
