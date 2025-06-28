import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller.js'
import { validate } from '../utils/validator.js'
import { schemas } from '../utils/validator.js'
import { authenticate } from '../middlewares/auth.middleware.js'

const router = Router()

// ✅ Public routes
router.post('/admin/login', validate(schemas.login), AuthController.adminLogin)
router.post('/login', validate(schemas.login), AuthController.login)
router.post('/request-access', validate(schemas.accessRequest), AuthController.requestAccess)
router.post('/verify-token', AuthController.verifyToken)
router.post('/request-password-reset', AuthController.requestPasswordReset)

// ✅ Protected routes
router.get('/me', authenticate, AuthController.getCurrentUser)
router.post('/change-password', authenticate, AuthController.changePassword)
router.post('/logout', authenticate, AuthController.logout)

export default router
