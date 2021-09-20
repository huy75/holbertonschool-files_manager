import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';

import express from 'express';

const router = express.Router();

// the get Routes
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

// the post Routes
router.post('/users', UsersController.postNew);

module.exports = router;
