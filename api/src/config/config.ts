import dotenv from 'dotenv';

dotenv.config();

const _config = {
    port: process.env.PORT || 7890,
}

export const config = Object.freeze(_config);