/**
 * Main server file for the OTT Claro Backend Simulation API
 * This file initializes Express, connects to MongoDB, sets up middleware, and starts the server
 */

// Import required packages
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');

// Import configuration
const config = require('./config/env.config');

// Import database connection
const connectDB = require('./db/mongoose');

// Import routes
const routes = require('./routes');

// Import Swagger documentation
const swaggerSetup = require('./swagger/swagger');

// Import error handling middleware
const { errorHandler } = require('./middleware/error.middleware');

// Initialize Express app
const app = express();

// Declare server variable in global scope for proper cleanup
let server;

// Enhanced server state tracking with detailed metrics
let serverState = {
  isInitialized: false,
  isShuttingDown: false,
  dbConnection: null,
  startTime: null,
  lastHealthCheck: null,
  activeConnections: 0,
  totalRequests: 0,
  errors: {
    count: 0,
    lastError: null,
    lastErrorTime: null,
    byStatusCode: {},
    byEndpoint: {}
  },
  performance: {
    lastMinuteRequests: 0,
    avgResponseTime: 0,
    responseTimePercentiles: {
      p50: 0,
      p75: 0,
      p90: 0,
      p95: 0,
      p99: 0
    },
    requestsPerSecond: 0,
    peakRequestsPerSecond: 0,
    byEndpoint: {},
    timeWindows: {
      lastMinute: {
        requests: 0,
        errors: 0,
        avgResponseTime: 0
      },
      lastHour: {
        requests: 0,
        errors: 0,
        avgResponseTime: 0
      },
      lastDay: {
        requests: 0,
        errors: 0,
        avgResponseTime: 0
      }
    },
    resourceUtilization: {
      memory: {
        usage: [],
        trend: 0
      },
      cpu: {
        usage: [],
        trend: 0
      },
      eventLoop: {
        latency: 0,
        lag: 0
      }
    }
  },
  resources: {
    memory: {
      used: 0,
      total: 0,
      peak: 0
    },
    cpu: {
      usage: 0,
      peak: 0
    }
  },
  database: {
    isConnected: false,
    lastReconnectAttempt: null,
    reconnectAttempts: 0,
    operationsPerSecond: 0
  }
};

// Initialize server with async IIFE
(async () => {
  try {
    console.log('Initializing server...');
    serverState.startTime = new Date();
    
    // Set up all middleware in a single location
    const setupMiddleware = () => {
      app.use(cors());
      app.use(helmet());
      app.use(morgan('dev'));
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(passport.initialize());
      require('./config/passport.config');
      swaggerSetup(app);
    };

    // Initialize middleware
    setupMiddleware();

    // Connect to MongoDB with simplified error handling
    console.log('Connecting to MongoDB...');
    try {
      const dbConnection = await connectDB();
      if (dbConnection) {
        serverState.dbConnection = dbConnection;
        console.log('Database connection established successfully');
      }
    } catch (dbError) {
      console.error('Database connection error:', dbError.message);
      console.warn('Starting server with limited functionality - database connection failed');
    }

    // Set up routes
    app.use('/api', routes);

    // Root route
    app.get('/', (req, res) => {
      res.json({
        message: 'Welcome to OTT Claro Backend Simulation API',
        documentation: '/api-docs'
      });
    });

    // Error handling middleware
    app.use(errorHandler);

    // Start server with enhanced error handling and monitoring
    const PORT = config.PORT || 3000;
    server = app.listen(PORT, () => {
      serverState.isInitialized = true;
      console.log(`Server is running on port ${PORT}`);
      console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
      console.log(`Server environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Process ID: ${process.pid}`);
    });

    // Enhanced server error handling
    server.on('error', (err) => {
      console.error('Server error:', {
        error: err.message,
        code: err.code,
        syscall: err.syscall
      });
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
      }
      cleanup(1);
    });

    // Enhanced server monitoring
    server.on('connection', (socket) => {
      serverState.activeConnections++;
      socket.on('error', (err) => {
        serverState.errors.count++;
        serverState.errors.lastError = err.message;
        serverState.errors.lastErrorTime = new Date();
        console.error('Socket error:', {
          error: err.message,
          timestamp: new Date().toISOString(),
          metrics: serverState
        });
      });
      socket.on('close', () => {
        serverState.activeConnections--;
      });
    });

    // Add enhanced request monitoring middleware with detailed metrics
    app.use((req, res, next) => {
      serverState.totalRequests++;
      const start = Date.now();
      const endpoint = `${req.method} ${req.path}`;

      // Initialize endpoint metrics if not exists
      if (!serverState.performance.byEndpoint[endpoint]) {
        serverState.performance.byEndpoint[endpoint] = {
          count: 0,
          totalTime: 0,
          avgResponseTime: 0,
          responseTimes: [],
          errors: 0
        };
      }

      // Update requests per second with time-window tracking
      const now = Date.now();
      const requestsLastSecond = serverState.totalRequests - (serverState.performance.lastRequestCount || 0);
      serverState.performance.requestsPerSecond = requestsLastSecond;
      if (requestsLastSecond > serverState.performance.peakRequestsPerSecond) {
        serverState.performance.peakRequestsPerSecond = requestsLastSecond;
      }
      serverState.performance.lastRequestCount = serverState.totalRequests;

      // Update time-window metrics
      const timeWindows = serverState.performance.timeWindows;
      timeWindows.lastMinute = {
        requests: serverState.totalRequests - (serverState._lastMinuteTotal || 0),
        errors: serverState.errors.count - (serverState._lastMinuteErrors || 0),
        avgResponseTime: serverState.performance.avgResponseTime
      };
      serverState._lastMinuteTotal = serverState.totalRequests;
      serverState._lastMinuteErrors = serverState.errors.count;

      // Update hourly metrics
      if (!serverState._lastHourUpdate || (now - serverState._lastHourUpdate) >= 3600000) {
        timeWindows.lastHour = {
          requests: serverState.totalRequests - (serverState._lastHourTotal || 0),
          errors: serverState.errors.count - (serverState._lastHourErrors || 0),
          avgResponseTime: serverState.performance.avgResponseTime
        };
        serverState._lastHourTotal = serverState.totalRequests;
        serverState._lastHourErrors = serverState.errors.count;
        serverState._lastHourUpdate = now;
      }

      // Update daily metrics
      if (!serverState._lastDayUpdate || (now - serverState._lastDayUpdate) >= 86400000) {
        timeWindows.lastDay = {
          requests: serverState.totalRequests - (serverState._lastDayTotal || 0),
          errors: serverState.errors.count - (serverState._lastDayErrors || 0),
          avgResponseTime: serverState.performance.avgResponseTime
        };
        serverState._lastDayTotal = serverState.totalRequests;
        serverState._lastDayErrors = serverState.errors.count;
        serverState._lastDayUpdate = now;
      }

      res.on('finish', () => {
        const duration = Date.now() - start;
        const endpointMetrics = serverState.performance.byEndpoint[endpoint];

        // Update endpoint-specific metrics
        endpointMetrics.count++;
        endpointMetrics.totalTime += duration;
        endpointMetrics.avgResponseTime = endpointMetrics.totalTime / endpointMetrics.count;
        endpointMetrics.responseTimes.push(duration);

        // Keep only last 1000 response times for percentile calculations
        if (endpointMetrics.responseTimes.length > 1000) {
          endpointMetrics.responseTimes.shift();
        }

        // Update overall response time metrics
        serverState.performance.avgResponseTime = 
          (serverState.performance.avgResponseTime * (serverState.totalRequests - 1) + duration) / serverState.totalRequests;

        // Calculate response time percentiles
        const sortedTimes = [...endpointMetrics.responseTimes].sort((a, b) => a - b);
        const len = sortedTimes.length;
        serverState.performance.responseTimePercentiles = {
          p50: sortedTimes[Math.floor(len * 0.5)] || 0,
          p75: sortedTimes[Math.floor(len * 0.75)] || 0,
          p90: sortedTimes[Math.floor(len * 0.9)] || 0,
          p95: sortedTimes[Math.floor(len * 0.95)] || 0,
          p99: sortedTimes[Math.floor(len * 0.99)] || 0
        };

        // Track errors by status code and endpoint
        if (res.statusCode >= 400) {
          serverState.errors.count++;
          serverState.errors.lastError = `${res.statusCode} error for ${endpoint}`;
          serverState.errors.lastErrorTime = new Date();
          serverState.errors.byStatusCode[res.statusCode] = (serverState.errors.byStatusCode[res.statusCode] || 0) + 1;
          serverState.errors.byEndpoint[endpoint] = (serverState.errors.byEndpoint[endpoint] || 0) + 1;
          endpointMetrics.errors++;
        }
      });

      next();
    });

    // Add periodic health check with enhanced monitoring and alerts
    setInterval(() => {
      const now = new Date();
      serverState.lastHealthCheck = now;
      serverState.performance.lastMinuteRequests = serverState.totalRequests;

      // Update resource metrics with enhanced tracking
      const memoryUsage = process.memoryUsage();
      const currentMemoryUsage = memoryUsage.heapUsed;
      serverState.resources.memory.used = currentMemoryUsage;
      serverState.resources.memory.total = memoryUsage.heapTotal;
      if (currentMemoryUsage > serverState.resources.memory.peak) {
        serverState.resources.memory.peak = currentMemoryUsage;
      }

      // Track memory usage history (keep last 60 samples)
      serverState.performance.resourceUtilization.memory.usage.push(currentMemoryUsage);
      if (serverState.performance.resourceUtilization.memory.usage.length > 60) {
        serverState.performance.resourceUtilization.memory.usage.shift();
      }

      // Calculate memory usage trend
      const memoryUsageHistory = serverState.performance.resourceUtilization.memory.usage;
      if (memoryUsageHistory.length >= 2) {
        const memoryTrend = (memoryUsageHistory[memoryUsageHistory.length - 1] - memoryUsageHistory[0]) / memoryUsageHistory.length;
        serverState.performance.resourceUtilization.memory.trend = memoryTrend;
      }

      const cpuUsage = process.cpuUsage();
      const currentCpuUsage = (cpuUsage.user + cpuUsage.system) / 1000000; // Convert to seconds
      serverState.resources.cpu.usage = currentCpuUsage;
      if (currentCpuUsage > serverState.resources.cpu.peak) {
        serverState.resources.cpu.peak = currentCpuUsage;
      }

      // Track CPU usage history (keep last 60 samples)
      serverState.performance.resourceUtilization.cpu.usage.push(currentCpuUsage);
      if (serverState.performance.resourceUtilization.cpu.usage.length > 60) {
        serverState.performance.resourceUtilization.cpu.usage.shift();
      }

      // Calculate CPU usage trend
      const cpuUsageHistory = serverState.performance.resourceUtilization.cpu.usage;
      if (cpuUsageHistory.length >= 2) {
        const cpuTrend = (cpuUsageHistory[cpuUsageHistory.length - 1] - cpuUsageHistory[0]) / cpuUsageHistory.length;
        serverState.performance.resourceUtilization.cpu.trend = cpuTrend;
      }

      // Monitor event loop health
      const start = process.hrtime();
      setImmediate(() => {
        const [seconds, nanoseconds] = process.hrtime(start);
        const latency = seconds * 1000 + nanoseconds / 1000000; // Convert to milliseconds
        serverState.performance.resourceUtilization.eventLoop.latency = latency;
        serverState.performance.resourceUtilization.eventLoop.lag = Math.max(0, latency - 1); // Anything above 1ms is considered lag
      });

      // Get enhanced database connection status
      const dbStatus = serverState.dbConnection ? {
        readyState: serverState.dbConnection.readyState,
        modelCount: Object.keys(serverState.dbConnection.models).length,
        collections: Object.keys(serverState.dbConnection.collections).length,
        poolInfo: serverState.dbConnection.client ? {
          totalConnections: serverState.dbConnection.client.topology.connections().length,
          activeConnections: serverState.dbConnection.client.topology.connections().filter(conn => conn.isConnected()).length,
          availableConnections: serverState.dbConnection.client.topology.connections().filter(conn => conn.isAvailable()).length,
          waitQueueSize: serverState.dbConnection.client.topology.waitQueueSize || 0
        } : null,
        operationalStatus: {
          isResponding: true,
          lastOperationLatency: 0
        }
      } : 'Not Connected';

      // Update database metrics
      if (serverState.dbConnection) {
        serverState.database.isConnected = serverState.dbConnection.readyState === 1;
        if (dbStatus !== 'Not Connected' && dbStatus.poolInfo) {
          serverState.database.operationsPerSecond = serverState.dbConnection.db.serverStatus().opcounters;
        }
      }

      // Check for potential issues
      const alerts = [];
      if (serverState.performance.avgResponseTime > 1000) { // Response time > 1s
        alerts.push({
          level: 'warning',
          message: 'High average response time detected',
          value: serverState.performance.avgResponseTime
        });
      }
      if (serverState.resources.memory.used / serverState.resources.memory.total > 0.9) { // Memory usage > 90%
        alerts.push({
          level: 'critical',
          message: 'High memory usage detected',
          value: (serverState.resources.memory.used / serverState.resources.memory.total * 100).toFixed(2) + '%'
        });
      }
      if (serverState.resources.cpu.usage > 80) { // CPU usage > 80%
        alerts.push({
          level: 'warning',
          message: 'High CPU usage detected',
          value: serverState.resources.cpu.usage.toFixed(2) + '%'
        });
      }

      console.log('Server health check:', {
        timestamp: now.toISOString(),
        metrics: {
          ...serverState,
          performance: {
            ...serverState.performance,
            responseTimePercentiles: serverState.performance.responseTimePercentiles,
            endpointMetrics: Object.fromEntries(
              Object.entries(serverState.performance.byEndpoint)
                .map(([endpoint, metrics]) => [
                  endpoint,
                  {
                    count: metrics.count,
                    avgResponseTime: metrics.avgResponseTime,
                    errors: metrics.errors
                  }
                ])
            )
          }
        },
        database: dbStatus,
        alerts: alerts.length > 0 ? alerts : 'No active alerts',
        processInfo: {
          uptime: process.uptime(),
          pid: process.pid,
          nodeVersion: process.version,
          platform: process.platform,
          arch: process.arch,
          memoryUsage: {
            heapUsed: memoryUsage.heapUsed,
            heapTotal: memoryUsage.heapTotal,
            external: memoryUsage.external,
            arrayBuffers: memoryUsage.arrayBuffers
          }
        }
      });
    }, 60000); // Check every minute

    // Export server and app instances for testing
    module.exports = { server, app };
  } catch (error) {
    console.error('Failed to initialize server:', error);
    cleanup(1);
  }
})();

// Enhanced cleanup function for graceful shutdown
const cleanup = async (exitCode = 0) => {
  if (serverState.isShuttingDown) {
    console.log('Shutdown already in progress...');
    return;
  }
  
  serverState.isShuttingDown = true;
  console.log('Initiating server cleanup...');
  
  try {
    // Set a timeout for the entire cleanup process
    const cleanupTimeout = setTimeout(() => {
      console.error('Cleanup timed out - forcing exit');
      process.exit(1);
    }, 30000);
    
    const tasks = [];
    
    // Close HTTP server if it's running
    if (server) {
      tasks.push(
        new Promise((resolve) => {
          server.close((err) => {
            if (err) {
              console.error('Error closing HTTP server:', err);
            } else {
              console.log('HTTP server closed successfully');
            }
            resolve();
          });
        })
      );
    }
    
    // Log detailed server statistics
    const uptime = new Date() - serverState.startTime;
    console.log('Server shutdown statistics:', {
      timestamp: new Date().toISOString(),
      uptime: Math.floor(uptime / 1000),
      totalRequests: serverState.totalRequests,
      errors: serverState.errors,
      performance: {
        avgResponseTime: serverState.performance.avgResponseTime,
        lastMinuteRequests: serverState.performance.lastMinuteRequests
      },
      memory: process.memoryUsage(),
      activeConnections: serverState.activeConnections
    });
    
    // Wait for all cleanup tasks to complete
    await Promise.all(tasks);
    clearTimeout(cleanupTimeout);
    
    console.log('Cleanup completed successfully');
    process.exit(exitCode);
  } catch (error) {
    console.error('Error during cleanup:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  cleanup(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  cleanup(1);
});

// Handle termination signals
process.on('SIGTERM', () => {
  console.log('Received SIGTERM signal');
  cleanup(0);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT signal');
  cleanup(0);
});
