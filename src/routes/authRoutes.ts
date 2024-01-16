import express from 'express';
const router = express.Router();

// Import from controllers
import {
  register,
  login,
  logout,
  getSession
} from '../controllers/authController';

// Routes
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/session').get(getSession);

export default router;
