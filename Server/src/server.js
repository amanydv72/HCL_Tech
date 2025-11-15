const app = require('./app');
const config = require('./config');
const db = require('./database/db');

const startServer = async () => {
  try {
    // Test database connection
    await db.query('SELECT NOW()');
    console.log('✓ Database connection verified');

    // Start server and bind to configured host (default 0.0.0.0) so it's reachable on local network
    const host = config.app.host || '0.0.0.0';
    app.listen(config.app.port, host, () => {
      console.log(`✓ Server running on ${host}:${config.app.port}`);
      console.log(`✓ Environment: ${config.app.env}`);
      console.log(`✓ API endpoint: http://${host}:${config.app.port}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

startServer();
