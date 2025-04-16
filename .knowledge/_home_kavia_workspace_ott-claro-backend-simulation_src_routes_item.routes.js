{"is_source_file": true, "format": "JavaScript", "description": "This file defines the routing for item CRUD operations using Express.js, including endpoints to create, read, update, and delete items.", "external_files": ["../controllers/item.controller", "../middleware/auth.middleware", "../middleware/cache.middleware"], "external_methods": ["itemController.getAllItems", "itemController.getItemById", "itemController.createItem", "itemController.updateItem", "itemController.deleteItem", "authenticate", "cacheMiddleware"], "published": [], "classes": [], "methods": [], "calls": ["cacheMiddleware()", "itemController.getAllItems", "cacheMiddleware()", "itemController.getItemById", "authenticate", "itemController.createItem", "authenticate", "itemController.updateItem", "authenticate", "itemController.deleteItem"], "search-terms": ["item", "CRUD", "Express", "routes"], "state": 2, "file_id": 19, "knowledge_revision": 25, "git_revision": "", "ctags": [{"_type": "tag", "name": "express", "path": "/home/kavia/workspace/ott-claro-backend-simulation/src/routes/item.routes.js", "pattern": "/^const express = require('express');$/", "language": "JavaScript", "kind": "constant"}, {"_type": "tag", "name": "itemController", "path": "/home/kavia/workspace/ott-claro-backend-simulation/src/routes/item.routes.js", "pattern": "/^const itemController = require('..\\/controllers\\/item.controller');$/", "language": "JavaScript", "kind": "constant"}, {"_type": "tag", "name": "router", "path": "/home/kavia/workspace/ott-claro-backend-simulation/src/routes/item.routes.js", "pattern": "/^const router = express.Router();$/", "language": "JavaScript", "kind": "constant"}], "filename": "/home/kavia/workspace/ott-claro-backend-simulation/src/routes/item.routes.js", "hash": "fcb49d7ec4b618313e0c9254878e1ade", "format-version": 4, "code-base-name": "default", "revision_history": [{"25": ""}]}