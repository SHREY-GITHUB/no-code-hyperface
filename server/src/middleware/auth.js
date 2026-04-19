/**
 * Simple API-key guard.  All /api/* routes pass through this.
 * Header: x-api-key: <value matching API_KEY env var>
 *
 * Replace with JWT / OAuth in production.
 */
function requireApiKey(req, res, next) {
  const key = req.headers['x-api-key']
  if (!key || key !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Missing or invalid API key.' })
  }
  next()
}

module.exports = { requireApiKey }
