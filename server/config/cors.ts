import cors from 'cors';

export const corsOptions: cors.CorsOptions = {
  origin: [
    'https://cmssingleaudio.com',
    'https://singleaudiodelivery.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
  exposedHeaders: ['set-cookie']
};
