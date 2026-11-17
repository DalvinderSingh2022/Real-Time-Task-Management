const buckets = new Map();

const rateLimit = ({ windowMs = 15 * 60 * 1000, max = 20 } = {}) => {
  return (req, res, next) => {
    const ip =
      req.ip ||
      req.headers["x-forwarded-for"] ||
      req.socket?.remoteAddress ||
      "unknown";
    const key = `${ip}:${req.baseUrl}${req.path}`;
    const now = Date.now();

    let entry = buckets.get(key);
    if (!entry || now > entry.reset) {
      entry = { count: 0, reset: now + windowMs };
    }
    entry.count += 1;
    buckets.set(key, entry);

    if (entry.count > max) {
      const retryAfter = Math.ceil((entry.reset - now) / 1000);
      res.set("Retry-After", String(retryAfter));
      return res
        .status(429)
        .json({ message: "Too many requests. Please try again later." });
    }
    next();
  };
};

// Periodically clear expired buckets to avoid unbounded memory growth.
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of buckets) {
    if (now > entry.reset) buckets.delete(key);
  }
}, 60 * 1000).unref();

module.exports = rateLimit;
