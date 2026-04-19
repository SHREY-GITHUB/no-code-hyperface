// ─────────────────────────────────────────────────────────────────────────────
// Hyperface Studio — Express API Server
// Port: process.env.PORT (default 3001)
// Dev: cd server && npm run dev
// ─────────────────────────────────────────────────────────────────────────────

require('dotenv').config()

const express    = require('express')
const cors       = require('cors')
const helmet     = require('helmet')
const morgan     = require('morgan')
const rateLimit  = require('express-rate-limit')

const { requireApiKey } = require('./middleware/auth')
const programsRouter     = require('./routes/programs')
const applicationsRouter = require('./routes/applications')
const analyticsRouter    = require('./routes/analytics')

const app = express()

// ─── Security & Logging ───────────────────────────────────────────────────────
app.use(helmet())
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

// ─── CORS ─────────────────────────────────────────────────────────────────────
// Allow Vite dev server + production domain
const allowedOrigins = [
  'http://localhost:5173',  // Vite dev
  'http://localhost:4173',  // Vite preview
  process.env.FRONTEND_URL, // production (set in .env)
].filter(Boolean)

app.use(cors({
  origin(origin, cb) {
    // Allow requests with no origin (curl, Postman, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
    cb(new Error(`CORS: origin ${origin} not allowed`))
  },
  credentials: true,
}))

// ─── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }))

// ─── Rate limiting ────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 60 * 1000,   // 1 minute
  max: 200,              // 200 req / min per IP — relaxed for dev
  standardHeaders: true,
  legacyHeaders: false,
})
app.use('/api', limiter)

// ─── Health check (no auth required) ─────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString(), env: process.env.NODE_ENV ?? 'development' })
})

// ─── API Routes (all protected by API key) ────────────────────────────────────
app.use('/api', requireApiKey)
app.use('/api/programs',     programsRouter)
app.use('/api/applications', applicationsRouter)
app.use('/api/analytics',    analyticsRouter)

// ─── Lightweight event ingestion (called by frontend analytics.js) ────────────
// Receives Mixpanel-style events from the browser and writes them to ApplicationEvents.
const { prisma } = require('./db')

app.post('/api/events', requireApiKey, async (req, res) => {
  try {
    const { eventName, properties = {} } = req.body
    if (!eventName) return res.status(400).json({ error: 'eventName is required.' })

    // Only persist events that belong to an application (applicant journey events)
    if (properties.applicationId) {
      await prisma.applicationEvent.create({
        data: {
          applicationId: properties.applicationId,
          eventType: eventName,
          stageName: properties.stageName ?? null,
          pageNumber: properties.pageNumber ?? null,
          timeSpentMs: properties.timeSpentMs ?? null,
          metadata: properties,
        },
      }).catch(() => {}) // silently ignore if applicationId invalid
    }

    res.json({ ok: true })
  } catch (err) {
    // Analytics must not error-out the client
    console.warn('[events] ingestion error:', err?.message)
    res.json({ ok: false })
  }
})

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  // Map Prisma errors to HTTP status codes
  if (err.code === 'P2002') return res.status(409).json({ error: 'A record with that value already exists.' })
  if (err.code === 'P2025') return res.status(404).json({ error: 'Record not found.' })
  if (err.code === 'P2003') return res.status(400).json({ error: 'Foreign key constraint violation.' })

  console.error('[API error]', err)
  res.status(err.status ?? 500).json({ error: err.message ?? 'Internal server error.' })
})

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT ?? '3001', 10)
app.listen(PORT, () => {
  console.log(`\n🚀 Hyperface Studio API running on http://localhost:${PORT}`)
  console.log(`   Health check: http://localhost:${PORT}/health`)
  console.log(`   DB Studio:    cd server && npm run db:studio\n`)
})
