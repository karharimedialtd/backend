import { Request, Response, NextFunction } from 'express';

export const requireRole = (roles: string | string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        message: 'You must be logged in to access this resource'
      });
    }

    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
        message: `This action requires ${allowedRoles.join(' or ')} role`
      });
    }

    next();
  };
};

// Specific role middlewares
export const requireAdmin = requireRole('admin');
export const requireUser = requireRole(['admin', 'user']);
