import express from 'express'
import nodemailer from 'nodemailer';

import { Email } from '../helpers/variables'
import { getClientByEmail } from '../database/Schemas/Client';
import { random } from '../helpers/auth';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: Email.ACC,
        pass: Email.PASS
    }
})

export const email_oneTimeKey = async (req: express.Request, res: express.Response) => {
    const { email } = req.body

    const client = await getClientByEmail(email).select('+oneTimeLoginKey.key +oneTimeLoginKey.expiresAt')
    if (!client) { 
        return res.status(404).send({ error: 'Client not found' })
    }

    if (client.oneTimeLoginKey.expiresAt > new Date()) {
        const minLeft = Math.ceil((client.oneTimeLoginKey.expiresAt.getTime() - new Date().getTime()) / 60000);
        return res.status(400).json({ error: `Key already sent. Please wait ${minLeft} minutes to create another one.` });
    }

    const key = random({size: 6});
    client.oneTimeLoginKey.key = key;
    client.oneTimeLoginKey.expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const updatedClient = await client.save();
    if (!updatedClient) {
        return res.status(500).json({ error: "Internal server error." });
    }

    const mailOptions = {
        from: Email.ACC,
        to: email,
        subject: 'Vibe Alley Music - One-time login key',
        text: `Your one-time login key is: ${key}`
    }

    try {
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: "Email sent.", showSuccess: true });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal server error." });
    }
}