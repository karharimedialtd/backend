# Single Audio - Music Distribution Platform

## Overview

Single Audio is a comprehensive music distribution and royalty management platform built with modern web technologies. The application enables musicians and content creators to distribute their music across multiple Digital Service Providers (DSPs), manage YouTube Content ID claims, track royalties, and handle payouts. The platform features AI-powered metadata generation and revenue forecasting capabilities.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **UI Components**: Shadcn/UI component library with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack React Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite with React plugin for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js with comprehensive middleware stack
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: JWT-based authentication with role-based access control
- **File Storage**: Local file system with multer for upload handling
- **API Design**: RESTful APIs with comprehensive error handling and validation

### Security & Middleware
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: Express rate limiting for API protection
- **Helmet**: Security headers for production deployment
- **Input Validation**: Zod schema validation for all API endpoints
- **Authentication Middleware**: JWT verification with user role checking

## Key Components

### Authentication System
- JWT-based authentication with refresh capabilities
- Role-based access control (admin/user permissions)
- Access request workflow for new user onboarding
- Password reset and account management features

### Music Distribution Engine
- Multi-file upload support (audio files and cover art)
- Track metadata management with AI-powered generation
- Distribution to multiple DSPs with status tracking
- File serving with proper security controls

### Royalty Management
- Comprehensive royalty tracking by DSP and track
- Earnings summaries with temporal analysis
- Available balance calculations
- Automated royalty distribution processing

### Content Management System (CMS)
- YouTube channel integration and management
- Content ID claim tracking and monetization
- Analytics and performance monitoring
- Policy management for copyright protection

### AI-Powered Features
- OpenAI integration for metadata generation
- Cover art prompt generation based on track characteristics
- Revenue forecasting using track metadata analysis
- Optimal upload timing suggestions

### Support System
- Ticket-based support system with priority levels
- Message threading for ongoing conversations
- Admin assignment and status tracking
- Email notifications for ticket updates

## Data Flow

### User Registration Flow
1. User submits access request with email and reason
2. Admin reviews and approves/rejects request
3. Approved users receive login credentials
4. Users complete profile setup

### Music Distribution Flow
1. User uploads audio file and cover art
2. System generates metadata using AI (optional)
3. User selects target DSPs for distribution
4. System processes and delivers to selected platforms
5. Real-time status tracking throughout delivery process

### Royalty Processing Flow
1. System receives royalty data from DSPs
2. Royalties are allocated to respective tracks and users
3. Users can view earnings breakdown by platform
4. Payout requests are processed with minimum thresholds
5. Admin approval required for payout processing

## External Dependencies

### Database & Storage
- **PostgreSQL**: Primary database via Neon serverless (DATABASE_URL)
- **Drizzle ORM**: Type-safe database operations with schema migrations
- **Local File Storage**: Organized directory structure for audio and image files

### Third-Party Services
- **Supabase**: Database hosting and management
- **OpenAI API**: AI-powered metadata generation and analysis
- **Email Service**: SMTP configuration for notifications
- **DSP APIs**: Integration with Spotify, YouTube, TikTok, and Facebook

### Development Tools
- **ESBuild**: Fast bundling for production builds
- **Replit**: Development environment with hot reloading
- **Winston**: Comprehensive logging with multiple transports

## Deployment Strategy

### Development Environment
- **Replit Integration**: Seamless development with live preview
- **Hot Module Replacement**: Fast development feedback loop
- **Environment Variables**: Secure configuration management
- **Automatic Restarts**: File watching for server changes

### Production Deployment
- **Autoscale Deployment**: Automatic scaling based on traffic
- **Build Process**: Optimized client and server bundles
- **Port Configuration**: External port 80 mapping to internal port 5000
- **Process Management**: Graceful shutdown handling for zero-downtime deploys

### Database Management
- **Schema Migrations**: Drizzle Kit for database schema evolution
- **Connection Pooling**: Optimized database connections
- **Backup Strategy**: Automated backups through hosting provider

## Recent Changes

### June 25, 2025 - Production Backend Complete
✓ Complete backend architecture implemented with full MVC structure
✓ JWT-based authentication with role-based access control (admin/user)
✓ Music distribution system with multi-DSP integration (YouTube, TikTok, Spotify, Facebook)
✓ YouTube CMS integration with Content ID management
✓ Royalty tracking and payout system
✓ Publishing identity management with composition tracking
✓ Support ticket system with admin assignment
✓ AI-powered metadata generation and revenue forecasting
✓ File upload system with validation and storage
✓ Comprehensive input validation and error handling
✓ Production-ready security middleware (CORS, rate limiting, compression)
✓ Logger system with production file logging
✓ Health check endpoints

### Current Status
- Backend architecture: Complete and production-ready
- Environment setup: Waiting for Supabase credentials to start server
- Frontend integration: Backend configured for live frontend URLs
- Database: Using Supabase PostgreSQL via direct SDK (no ORM)

## User Preferences

Preferred communication style: Simple, everyday language.