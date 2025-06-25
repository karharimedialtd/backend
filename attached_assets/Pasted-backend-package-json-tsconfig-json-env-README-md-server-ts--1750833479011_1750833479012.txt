backend/
├── package.json
├── tsconfig.json
├── .env
├── README.md
├── server.ts               # Entry point (starts server)
├── app.ts                  # Middleware, global config, request logging

├── config/
│   ├── env.ts              # Environment variable validation
│   ├── supabase.ts         # Supabase client (anon + service role)
│   └── cors.ts             # Production CORS setup using real frontend URLs

├── routes/
│   ├── index.ts            # Route registration
│   ├── auth.routes.ts
│   ├── user.routes.ts
│   ├── admin.routes.ts
│   ├── music.routes.ts
│   ├── cms.routes.ts
│   ├── royalties.routes.ts
│   ├── payout.routes.ts
│   ├── publishing.routes.ts
│   ├── support.routes.ts
│   ├── ai.routes.ts
│   └── dsp.routes.ts

├── controllers/
│   ├── auth.controller.ts
│   ├── user.controller.ts
│   ├── admin.controller.ts
│   ├── music.controller.ts
│   ├── cms.controller.ts
│   ├── royalties.controller.ts
│   ├── payout.controller.ts
│   ├── publishing.controller.ts
│   ├── support.controller.ts
│   ├── ai.controller.ts
│   └── dsp.controller.ts

├── services/
│   ├── auth.service.ts
│   ├── user.service.ts
│   ├── admin.service.ts
│   ├── music.service.ts
│   ├── cms.service.ts
│   ├── royalties.service.ts
│   ├── payout.service.ts
│   ├── publishing.service.ts
│   ├── support.service.ts
│   ├── ai.service.ts
│   └── dsp.service.ts

├── models/
│   ├── user.model.ts
│   ├── admin.model.ts
│   ├── music.model.ts
│   ├── cms.model.ts
│   ├── royalties.model.ts
│   ├── payout.model.ts
│   ├── publishing.model.ts
│   ├── support.model.ts
│   ├── ai.model.ts
│   └── dsp.model.ts

├── middlewares/
│   ├── auth.middleware.ts      # JWT + role check
│   ├── role.middleware.ts      # Admin/user route protection
│   └── error.middleware.ts     # Global error handler

├── utils/
│   ├── jwt.ts                  # Sign/verify tokens
│   ├── logger.ts               # Logger class for console + file logging
│   ├── mailer.ts               # For sending email (invite, payout, etc.)
│   ├── uploader.ts             # File uploads to storage
│   └── validator.ts            # Input validation utils

├── types/
│   ├── supabase.types.ts       # Supabase types/interfaces
│   └── global.d.ts             # Optional global type extensions
✅ Optional (for testing and dev)
bash
Copy
Edit
tests/
├── auth.test.ts
├── music.test.ts
└── ...

scripts/
└── seed.ts     # Optional database seeding for testing
🧠 Notes
Every route has its own controller, service, and model file.

Admin and user functionality are completely separated in routing and middleware.

All frontend connections are handled through production URLs in cors.ts.

All data operations should go through the Supabase SDK using supabase.ts.