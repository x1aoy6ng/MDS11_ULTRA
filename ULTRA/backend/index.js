const express = require("express");
const cors = require("cors");
const helmet = require('helmet')
const rateLimit = require('express-rate-limit');
require('dotenv').config();

//import routes
const routes = require("./src/routes/routes.js");
const authRoutes = require('./src/routes/auth.js');

const app = express();
// security middleware
app.use(helmet());

// app.use(cors()); // allow React frontend to talk to backend
app.use(cors({
  origin: "http://localhost:5173"   // allow your React frontend
}));

// rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(generalLimiter);

// body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// request logging middleware (moved to correct position)
app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.url}`);
  next();
});

// health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString() 
  });
});

// routes
app.use('/api/auth', authRoutes);
app.use('/', routes);

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : error.message
  });
});

// start server
const port = process.env.PORT || 5027;
app.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});
