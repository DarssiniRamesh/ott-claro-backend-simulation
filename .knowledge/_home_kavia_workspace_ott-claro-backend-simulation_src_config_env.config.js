{"is_source_file": true, "format": "JavaScript", "description": "Environment configuration file that loads environment variables and exports them for use throughout the application.", "external_files": [".env"], "external_methods": [], "published": ["PORT", "NODE_ENV", "MONGODB_URI", "JWT_SECRET", "JWT_EXPIRATION", "API_VERSION", "CACHE_DURATION"], "classes": [], "methods": [], "calls": ["require('dotenv').config()"], "search-terms": ["environment configuration", "server config", "MongoDB URI", "JWT settings", "API version", "cache duration"], "state": 2, "file_id": 10, "knowledge_revision": 7, "git_revision": "", "ctags": [{"_type": "tag", "name": "API_VERSION", "path": "/home/kavia/workspace/ott-claro-backend-simulation/src/config/env.config.js", "pattern": "/^  API_VERSION: process.env.API_VERSION || 'v1',$/", "language": "JavaScript", "kind": "property", "scope": "module.exports", "scopeKind": "class"}, {"_type": "tag", "name": "CACHE_DURATION", "path": "/home/kavia/workspace/ott-claro-backend-simulation/src/config/env.config.js", "pattern": "/^  CACHE_DURATION: parseInt(process.env.CACHE_DURATION || '300'), \\/\\/ 5 minutes in seconds$/", "language": "JavaScript", "kind": "property", "scope": "module.exports", "scopeKind": "class"}, {"_type": "tag", "name": "JWT_EXPIRATION", "path": "/home/kavia/workspace/ott-claro-backend-simulation/src/config/env.config.js", "pattern": "/^  JWT_EXPIRATION: process.env.JWT_EXPIRATION || '1d',$/", "language": "JavaScript", "kind": "property", "scope": "module.exports", "scopeKind": "class"}, {"_type": "tag", "name": "JWT_SECRET", "path": "/home/kavia/workspace/ott-claro-backend-simulation/src/config/env.config.js", "pattern": "/^  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',$/", "language": "JavaScript", "kind": "property", "scope": "module.exports", "scopeKind": "class"}, {"_type": "tag", "name": "MONGODB_URI", "path": "/home/kavia/workspace/ott-claro-backend-simulation/src/config/env.config.js", "pattern": "/^  MONGODB_URI: process.env.MONGODB_URI || 'mongodb:\\/\\/localhost:27017\\/ott-claro-api',$/", "language": "JavaScript", "kind": "property", "scope": "module.exports", "scopeKind": "class"}, {"_type": "tag", "name": "NODE_ENV", "path": "/home/kavia/workspace/ott-claro-backend-simulation/src/config/env.config.js", "pattern": "/^  NODE_ENV: process.env.NODE_ENV || 'development',$/", "language": "JavaScript", "kind": "property", "scope": "module.exports", "scopeKind": "class"}, {"_type": "tag", "name": "PORT", "path": "/home/kavia/workspace/ott-claro-backend-simulation/src/config/env.config.js", "pattern": "/^  PORT: process.env.PORT || 3000,$/", "language": "JavaScript", "kind": "property", "scope": "module.exports", "scopeKind": "class"}, {"_type": "tag", "name": "exports", "path": "/home/kavia/workspace/ott-claro-backend-simulation/src/config/env.config.js", "pattern": "/^module.exports = {$/", "language": "JavaScript", "kind": "class", "scope": "module", "scopeKind": "class"}], "filename": "/home/kavia/workspace/ott-claro-backend-simulation/src/config/env.config.js", "hash": "d71d64febbb65acd8a22c43ddd3ac654", "format-version": 4, "code-base-name": "default", "fields": [{"name": "API_VERSION: process.env.API_VERSION || 'v1',", "scope": "module.exports", "scopeKind": "class", "description": "unavailable"}, {"name": "CACHE_DURATION: parseInt(process.env.CACHE_DURATION || '300'), \\/\\/ 5 minutes in seconds", "scope": "module.exports", "scopeKind": "class", "description": "unavailable"}, {"name": "JWT_EXPIRATION: process.env.JWT_EXPIRATION || '1d',", "scope": "module.exports", "scopeKind": "class", "description": "unavailable"}, {"name": "JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',", "scope": "module.exports", "scopeKind": "class", "description": "unavailable"}, {"name": "MONGODB_URI: process.env.MONGODB_URI || 'mongodb:\\/\\/localhost:27017\\/ott-claro-api',", "scope": "module.exports", "scopeKind": "class", "description": "unavailable"}, {"name": "NODE_ENV: process.env.NODE_ENV || 'development',", "scope": "module.exports", "scopeKind": "class", "description": "unavailable"}, {"name": "PORT: process.env.PORT || 3000,", "scope": "module.exports", "scopeKind": "class", "description": "unavailable"}], "revision_history": [{"7": ""}]}