{"is_source_file": true, "format": "JavaScript", "description": "Defines routes for asset and metadata operations in the Asset and Playback API (APA). It includes route definitions for fetching asset information and metadata using the Express framework.", "external_files": ["../controllers/apa.controller", "../middleware/cache.middleware"], "external_methods": ["apaController.getAsset", "apaController.getMetadata", "cacheMiddleware"], "published": [], "classes": [], "methods": [], "calls": ["cacheMiddleware", "apaController.getAsset", "cacheMiddleware", "apaController.getMetadata"], "search-terms": ["Asset and Playback API", "APA routes", "Express routes"], "state": 2, "file_id": 33, "knowledge_revision": 68, "git_revision": "57a58ad21c3e680c2cf09612793259ee7b93dd86", "revision_history": [{"61": ""}, {"68": "57a58ad21c3e680c2cf09612793259ee7b93dd86"}], "ctags": [{"_type": "tag", "name": "apaController", "path": "/home/kavia/workspace/ott-claro-backend-simulation/src/routes/apa.routes.js", "pattern": "/^const apaController = require('..\\/controllers\\/apa.controller');$/", "language": "JavaScript", "kind": "constant"}, {"_type": "tag", "name": "express", "path": "/home/kavia/workspace/ott-claro-backend-simulation/src/routes/apa.routes.js", "pattern": "/^const express = require('express');$/", "language": "JavaScript", "kind": "constant"}, {"_type": "tag", "name": "router", "path": "/home/kavia/workspace/ott-claro-backend-simulation/src/routes/apa.routes.js", "pattern": "/^const router = express.Router();$/", "language": "JavaScript", "kind": "constant"}], "filename": "/home/kavia/workspace/ott-claro-backend-simulation/src/routes/apa.routes.js", "hash": "afbb26e9a50a74ccbd819e2c203ae04c", "format-version": 4, "code-base-name": "default"}