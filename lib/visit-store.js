function storeConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;
  return { url: `${url.replace(/\/$/, '')}/rest/v1/portfolio_visits`, headers: { apikey: key, 'Content-Type': 'application/json' } };
}
module.exports = { storeConfig };
