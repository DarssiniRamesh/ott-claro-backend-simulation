import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const router = Router();
const userController = new UserController();

/**
 * @route GET /user/startheaderinfo
 * @desc Get user start header information including region and session details
 * @access Public
 * @query authpn - Vendor Authentication User (tataelxsi)
 * @query authpt - Encrypted vendor authentication key (vofee7ohhecai)
 */
router.get('/user/startheaderinfo', (req, res) => userController.getStartHeaderInfo(req, res));

export default router;
