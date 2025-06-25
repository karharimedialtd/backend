import { Router } from 'express';
import { MusicController } from '../controllers/music.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requireUser, requireAdmin } from '../middlewares/role.middleware.js';
import { validate, validateParams } from '../utils/validator.js';
import { schemas } from '../utils/validator.js';
import { uploadConfigs } from '../utils/uploader.js';
import { z } from 'zod';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Track management
router.get('/tracks', requireUser, MusicController.getTracks);
router.post('/tracks', requireUser, uploadConfigs.musicTrack, validate(schemas.musicTrack), MusicController.createTrack);
router.get('/tracks/:id', requireUser, validateParams(z.object({ id: z.string().uuid() })), MusicController.getTrackById);
router.put('/tracks/:id', requireUser, validateParams(z.object({ id: z.string().uuid() })), MusicController.updateTrack);
router.delete('/tracks/:id', requireUser, validateParams(z.object({ id: z.string().uuid() })), MusicController.deleteTrack);

// Distribution management
router.post('/distribute', requireUser, validate(schemas.distribution), MusicController.createDistribution);
router.get('/distributions', requireUser, MusicController.getDistributions);
router.get('/distributions/:id', requireUser, validateParams(z.object({ id: z.string().uuid() })), MusicController.getDistributionById);
router.put('/distributions/:id/status', requireUser, validateParams(z.object({ id: z.string().uuid() })), MusicController.updateDistributionStatus);

// Admin routes
router.get('/admin/tracks', requireAdmin, MusicController.getAllTracks);
router.get('/admin/distributions', requireAdmin, MusicController.getAllDistributions);

// File serving
router.get('/files/audio/:filename', MusicController.serveAudioFile);
router.get('/files/covers/:filename', MusicController.serveCoverFile);

export default router;
