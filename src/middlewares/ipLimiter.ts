import express from 'express';
import rateLimit from 'express-rate-limit';

// Konfiguracja ipLimiter w sposób statyczny
export const ipLimiter = (limit: number, windowMs: number, message: string) => {
    return rateLimit({
        windowMs,
        max: limit,
        message: { error: message },
        headers: true,
    });
};