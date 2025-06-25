import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import adminRoutes from './admin.routes.js';
import musicRoutes from './music.routes.js';
import cmsRoutes from './cms.routes.js';
import royaltiesRoutes from './royalties.routes.js';
import payoutRoutes from './payout.routes.js';
import publishingRoutes from './publishing.routes.js';
import supportRoutes from './support.routes.js';
import aiRoutes from './ai.routes.js';
import dspRoutes from './dsp.routes.js';

const router = Router();

// Mount all route modules
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/admin', adminRoutes);
router.use('/music', musicRoutes);
router.use('/cms', cmsRoutes);
router.use('/royalties', royaltiesRoutes);
router.use('/payouts', payoutRoutes);
router.use('/publishing', publishingRoutes);
router.use('/support', supportRoutes);
router.use('/ai', aiRoutes);
router.use('/dsp', dspRoutes);

// API health check
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Single Audio API is running',
    version: '1.0.0',
    endpoints: [
      '/auth - Authentication',
      '/user - User management',
      '/admin - Admin functions',
      '/music - Music distribution',
      '/cms - YouTube CMS',
      '/royalties - Royalty tracking',
      '/payouts - Payout requests',
      '/publishing - Publishing identity',
      '/support - Support tickets',
      '/ai - AI tools',
      '/dsp - DSP management'
    ]
  });
});

export default router;
