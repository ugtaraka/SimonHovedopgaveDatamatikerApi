import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname analog i ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Loader .env her direkte i config
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Konfiguration
export const config = {
    baseUrl: process.env.OPENWEATHER_BASE_URL || '',
    apiKey: process.env.OPENWEATHER_API_KEY || '',
    timeoutMs: parseInt(process.env.REQUEST_TIMEOUT_MS) || 5000
};

if (!config.apiKey) {
    throw new Error('API key is missing. Set OPENWEATHER_API_KEY in .env');
}
