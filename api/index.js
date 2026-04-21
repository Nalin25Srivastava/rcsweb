console.log("Vercel Invocation: api/index.js is being called");
try {
  module.exports = require('../backend/server');
} catch (e) {
  console.error("CRITICAL REQUIRE CRASH:", e);
  module.exports = (req, res) => {
    res.status(500).json({
      success: false,
      message: 'CRITICAL CRASH ON VERCEL: ' + e.message,
      stack: e.stack
    });
  };
}
