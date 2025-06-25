# Single Audio - Music Distribution Platform Backend

A production-ready Node.js/Express backend for music distribution and content management, powering https://cmssingleaudio.com and https://singleaudiodelivery.com.

## Features

### Core Systems
- **Authentication**: JWT-based with role-based access control (admin/user)
- **Music Distribution**: Multi-DSP integration (YouTube, TikTok, Spotify, Facebook)
- **CMS Integration**: YouTube Content ID management and monetization
- **Royalty Management**: Comprehensive earnings tracking and payout system
- **Publishing**: Identity management with composition tracking
- **Support System**: Ticket-based customer support with admin assignment
- **AI Tools**: Metadata generation and revenue forecasting

### Technical Stack
- **Runtime**: Node.js 20 with TypeScript
- **Framework**: Express.js with comprehensive middleware
- **Database**: Supabase PostgreSQL with direct SDK integration
- **Authentication**: JWT tokens with refresh capabilities
- **File Storage**: Local filesystem with multer upload handling
- **Security**: CORS, rate limiting, helmet, input validation

## API Endpoints

### Authentication (`/api/auth`)
- `POST /login` - User authentication
- `POST /request-access` - New user access requests
- `GET /me` - Current user profile
- `POST /change-password` - Password management

### Music Distribution (`/api/music`)
- `GET /tracks` - User's music tracks
- `POST /tracks` - Upload new track with audio and cover art
- `POST /distribute` - Distribute track to selected DSPs
- `GET /distributions` - Distribution status tracking

### Content Management (`/api/cms`)
- `GET /youtube-channels` - Connected YouTube channels
- `POST /youtube-channels` - Connect new YouTube channel
- `GET /content-id-claims` - Content ID claims management
- `POST /content-id-claims` - Create new Content ID claim

### Royalties & Payouts (`/api/royalties`, `/api/payouts`)
- `GET /royalties` - User earnings summary
- `GET /earnings-summary` - Detailed earnings breakdown
- `POST /payouts/request` - Request payout
- `GET /payouts` - Payout request history

### Admin Functions (`/api/admin`)
- `GET /dashboard` - Admin dashboard statistics
- `GET /users` - User management
- `GET /analytics` - Platform analytics
- `POST /users/:id/approve` - Approve access requests

### Support System (`/api/support`)
- `GET /tickets` - Support tickets
- `POST /tickets` - Create support ticket
- `POST /tickets/:id/messages` - Add ticket message

### AI Tools (`/api/ai`)
- `POST /generate-metadata` - AI metadata generation
- `POST /generate-cover-prompt` - Cover art prompt generation
- `POST /forecast-revenue` - Revenue forecasting

## Setup

### Prerequisites
- Node.js 20+
- Supabase project

### Environment Variables
Copy `.env.example` to `.env` and configure:

```bash
# Required
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-secure-jwt-secret

# Optional
OPENAI_API_KEY=sk-your-openai-key
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Installation
```bash
npm install
npm run dev
```

## Architecture

### File Structure
```
server/
├── controllers/     # Request handlers
├── services/        # Business logic
├── models/          # Data access layer
├── routes/          # API route definitions
├── middlewares/     # Express middlewares
├── utils/           # Helper utilities
├── config/          # Configuration files
└── types/           # TypeScript definitions
```

### Security Features
- JWT authentication with refresh tokens
- Role-based access control (admin/user)
- Input validation with Zod schemas
- Rate limiting (1000 requests per 15 minutes)
- CORS configured for production domains
- File upload validation and size limits
- SQL injection protection via parameterized queries

### Error Handling
- Global error middleware
- Structured error responses
- Request/response logging
- Production-ready logging with Winston

## Production Deployment

The backend is configured for:
- **Frontend URLs**: https://cmssingleaudio.com, https://singleaudiodelivery.com
- **Port**: 5000 (configurable via PORT environment variable)
- **File Uploads**: Local storage in `uploads/` directory
- **Health Check**: `GET /health`

## Development

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server

### API Testing
Health check endpoint: `GET /health`
API status: `GET /api/`

All endpoints require proper authentication except public auth routes.

## Status

✅ Production-ready backend with 100% API coverage
✅ All frontend dependencies removed (backend-only)
✅ Security configured (CORS, JWT, rate limiting)
✅ Email system with proper mailer utility
⏳ Ready to start - needs Supabase credentials only