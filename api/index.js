let app;
try {
  app = require('../backend/server');
} catch (error) {
  const fs = require('fs');
  const path = require('path');
  
  // Return diagnostic info as JSON instead of crashing with HTML 500
  module.exports = (req, res) => {
    console.error('FATAL STARTUP ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Server failed to initialize. Root cause: ' + error.message,
      error: error.message,
      stack: error.stack,
      dir: __dirname,
      files: fs.readdirSync(__dirname),
      parentFiles: fs.readdirSync(path.join(__dirname, '..'))
    });
  };
  return;
}

module.exports = app;
