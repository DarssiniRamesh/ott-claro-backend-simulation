/**
 * MongoDB connection setup using Mongoose
 * Establishes a connection to MongoDB using the connection string from environment variables
 * Implements retry mechanism, connection monitoring, health checks, and graceful cleanup
 */

const mongoose = require('mongoose');
const config = require('../config/env.config');

// Connection states for better logging and monitoring
const STATES = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
  99: 'uninitialized'
};

// Connection health metrics with enhanced pool monitoring and performance tracking
let connectionMetrics = {
  lastConnectedAt: null,
  disconnectionCount: 0,
  reconnectionCount: 0,
  lastErrorAt: null,
  errorCount: 0,
  isHealthy: false,
  pool: {
    totalConnections: 0,
    activeConnections: 0,
    availableConnections: 0,
    pendingConnections: 0,
    maxPoolSize: 0,
    minPoolSize: 0,
    waitQueueSize: 0
  },
  performance: {
    operationsPerSecond: 0,
    averageLatency: 0,
    lastMinuteOperations: 0,
    peakConnections: 0,
    queryLatency: {
      read: 0,
      write: 0,
      aggregate: 0
    },
    operationTypes: {
      insert: 0,
      query: 0,
      update: 0,
      delete: 0,
      aggregate: 0
    },
    connectionPool: {
      utilizationRate: 0,
      waitQueueLength: 0,
      waitQueueLatency: 0
    }
  },
  errors: {
    network: 0,
    timeout: 0,
    auth: 0,
    other: 0,
    lastError: {
      message: null,
      code: null,
      timestamp: null
    }
  },
  status: {
    lastHealthCheck: null,
    consecutiveFailures: 0,
    isInGracePeriod: false
  }
};

/**
 * Connect to MongoDB using Mongoose with enhanced error handling and monitoring
 * @returns {Promise<mongoose.Connection|null>} Mongoose connection or null if connection fails
 */
const connectDB = async () => {
  const maxRetries = 3;
  let retries = 0;
  let isShuttingDown = false;
  
  // Remove existing listeners to prevent memory leaks
  mongoose.connection.removeAllListeners();
  
  // Set up connection event handlers with enhanced monitoring and logging
  mongoose.connection.on('connected', () => {
    connectionMetrics.lastConnectedAt = new Date();
    connectionMetrics.isHealthy = true;
    console.log('MongoDB connected successfully', {
      timestamp: new Date().toISOString(),
      poolSize: mongoose.connection.config.maxPoolSize,
      readyState: STATES[mongoose.connection.readyState],
      metrics: connectionMetrics
    });
  });
  
  mongoose.connection.on('error', (err) => {
    connectionMetrics.lastErrorAt = new Date();
    connectionMetrics.errorCount++;
    connectionMetrics.isHealthy = false;

    // Categorize errors for better monitoring
    if (err.name === 'MongoNetworkError' || err.code === 'ECONNREFUSED') {
      connectionMetrics.errors.network++;
    } else if (err.name === 'MongoTimeoutError') {
      connectionMetrics.errors.timeout++;
    } else if (err.name === 'MongoServerSelectionError') {
      connectionMetrics.errors.network++;
    } else if (err.message.includes('Authentication failed')) {
      connectionMetrics.errors.auth++;
    } else {
      connectionMetrics.errors.other++;
    }

    console.error('MongoDB connection error:', {
      timestamp: new Date().toISOString(),
      error: err.message,
      code: err.code,
      name: err.name,
      state: STATES[mongoose.connection.readyState],
      metrics: connectionMetrics
    });
  });
  
  mongoose.connection.on('disconnected', () => {
    connectionMetrics.disconnectionCount++;
    connectionMetrics.isHealthy = false;
    console.log('MongoDB disconnected', {
      timestamp: new Date().toISOString(),
      isShuttingDown,
      metrics: connectionMetrics
    });
    
    if (!isShuttingDown) {
      console.log('Attempting to reconnect...');
    }
  });

  mongoose.connection.on('reconnected', () => {
    connectionMetrics.reconnectionCount++;
    connectionMetrics.isHealthy = true;
    console.log('MongoDB reconnected successfully', {
      timestamp: new Date().toISOString(),
      metrics: connectionMetrics
    });
  });

  // Add periodic health check with enhanced pool monitoring and performance tracking
  const healthCheckInterval = setInterval(() => {
    if (!isShuttingDown) {
      const state = mongoose.connection.readyState;
      const now = new Date();
      connectionMetrics.status.lastHealthCheck = now;
      connectionMetrics.isHealthy = state === 1;

      // Update pool metrics if connected
      if (state === 1 && mongoose.connection.client) {
        const pool = mongoose.connection.client.topology.connections();
        const currentPoolSize = pool.length;
        
        // Update pool metrics
        connectionMetrics.pool.totalConnections = currentPoolSize;
        connectionMetrics.pool.activeConnections = pool.filter(conn => conn.isConnected()).length;
        connectionMetrics.pool.availableConnections = pool.filter(conn => conn.isAvailable()).length;
        connectionMetrics.pool.pendingConnections = pool.filter(conn => conn.isPending()).length;
        connectionMetrics.pool.maxPoolSize = mongoose.connection.config.maxPoolSize;
        connectionMetrics.pool.minPoolSize = mongoose.connection.config.minPoolSize;
        connectionMetrics.pool.waitQueueSize = mongoose.connection.client.topology.waitQueueSize || 0;

        // Update performance metrics
        if (currentPoolSize > connectionMetrics.performance.peakConnections) {
          connectionMetrics.performance.peakConnections = currentPoolSize;
        }

        // Calculate detailed operation metrics
        const opCounters = mongoose.connection.db.serverStatus().opcounters;
        const totalOps = Object.values(opCounters).reduce((a, b) => a + b, 0);
        connectionMetrics.performance.operationsPerSecond = totalOps;
        connectionMetrics.performance.lastMinuteOperations = totalOps;

        // Update operation type metrics
        connectionMetrics.performance.operationTypes = {
          insert: opCounters.insert || 0,
          query: opCounters.query || 0,
          update: opCounters.update || 0,
          delete: opCounters.delete || 0,
          aggregate: opCounters.command || 0
        };

        // Calculate connection pool utilization
        const utilizationRate = connectionMetrics.pool.activeConnections / connectionMetrics.pool.totalConnections;
        connectionMetrics.performance.connectionPool.utilizationRate = utilizationRate;
        connectionMetrics.performance.connectionPool.waitQueueLength = connectionMetrics.pool.waitQueueSize;

        // Get server status for latency metrics
        const serverStatus = mongoose.connection.db.serverStatus();
        if (serverStatus.opLatencies) {
          connectionMetrics.performance.queryLatency = {
            read: serverStatus.opLatencies.reads?.latency || 0,
            write: serverStatus.opLatencies.writes?.latency || 0,
            aggregate: serverStatus.opLatencies.commands?.latency || 0
          };
        }

        // Reset consecutive failures on successful check
        connectionMetrics.status.consecutiveFailures = 0;
        connectionMetrics.status.isInGracePeriod = false;
      }

      if (state !== 1) {
        connectionMetrics.status.consecutiveFailures++;
        
        // Set grace period if too many consecutive failures
        if (connectionMetrics.status.consecutiveFailures >= 3) {
          connectionMetrics.status.isInGracePeriod = true;
        }

        console.warn('MongoDB connection health check failed', {
          timestamp: now.toISOString(),
          currentState: STATES[state],
          consecutiveFailures: connectionMetrics.status.consecutiveFailures,
          isInGracePeriod: connectionMetrics.status.isInGracePeriod,
          metrics: connectionMetrics
        });
      } else {
        console.log('MongoDB connection health check passed', {
          timestamp: now.toISOString(),
          poolMetrics: connectionMetrics.pool,
          performanceMetrics: connectionMetrics.performance,
          errorMetrics: connectionMetrics.errors
        });
      }
    }
  }, 30000); // Check every 30 seconds
  
  // Simplified cleanup function with direct connection close
  const cleanup = async () => {
    isShuttingDown = true;
    clearInterval(healthCheckInterval);
    
    if (mongoose.connection.readyState === 1) {
      console.log('Initiating MongoDB connection cleanup', {
        timestamp: new Date().toISOString(),
        metrics: connectionMetrics
      });
      
      try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed gracefully', {
          timestamp: new Date().toISOString(),
          finalMetrics: connectionMetrics
        });
      } catch (err) {
        console.error('Error during MongoDB connection cleanup:', {
          timestamp: new Date().toISOString(),
          error: err.message,
          metrics: connectionMetrics
        });
        throw err;
      }
    }
  };
  
  // Clean up on process termination with enhanced error handling
  process.on('SIGINT', async () => {
    try {
      await cleanup();
      process.exit(0);
    } catch (err) {
      console.error('Failed to cleanup MongoDB connection:', err);
      process.exit(1);
    }
  });
  
  process.on('SIGTERM', async () => {
    try {
      await cleanup();
      process.exit(0);
    } catch (err) {
      console.error('Failed to cleanup MongoDB connection:', err);
      process.exit(1);
    }
  });
  
  while (retries < maxRetries) {
    try {
      // Connect to MongoDB with simplified essential options
      await mongoose.connect(config.MONGODB_URI, {
        maxPoolSize: 10,
        minPoolSize: 2,
        retryWrites: true,
        retryReads: true,
        w: 'majority',
        keepAlive: true
      });
      
      console.log('MongoDB connection options configured successfully');
      return mongoose.connection;
    } catch (error) {
      retries++;
      console.error(`Error connecting to MongoDB (attempt ${retries}/${maxRetries}):`, {
        message: error.message,
        code: error.code,
        state: STATES[mongoose.connection.readyState]
      });
      
      if (error.code === 'ECONNREFUSED') {
        console.error(`Could not connect to MongoDB at ${config.MONGODB_URI}. Please ensure MongoDB is running.`);
      } else if (error.name === 'MongoServerSelectionError') {
        console.error('Failed to select a MongoDB server. Please check network connectivity and server status.');
      } else if (error.name === 'MongooseServerSelectionError') {
        console.error('Failed to select a MongoDB server. The server may be down or unreachable.');
      }
      
      if (retries < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, retries), 10000); // Exponential backoff with max 10s
        console.log(`Retrying connection in ${delay/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error('Failed to connect to MongoDB after multiple attempts. Starting server without database connection.');
        console.error('The application will run with limited functionality.');
        // Return null instead of exiting to allow the server to start without DB
        return null;
      }
    }
  }
};

module.exports = connectDB;
