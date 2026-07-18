const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const logger = require('./utils/logger');
const authRoutes = require('./routes/authRoutes');
const publicRoutes = require('./routes/publicRoutes');
const crmRoutes = require('./routes/crmRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security and utility middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple logger middleware for requests
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', publicRoutes);
app.use('/api/crm', crmRoutes);

// In the single-service production deployment, Express serves the Vite build.
// API routes above remain available under /api; all other browser routes go to React.
if (process.env.NODE_ENV === 'production') {
  const frontendDist = path.resolve(__dirname, '../../frontend/dist');
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path === '/health') return next();
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// Health Check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Centralized error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled Error: %o', err);
  res.status(500).json({ 
    message: 'An unexpected error occurred on the server',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

// Start Server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
