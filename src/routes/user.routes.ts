import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const router = Router();
const userController = new UserController();

/**
 * @route GET /user/startheaderinfo
 * @desc Get user start header information including region and session details
 * @access Public
 * @query {string} authpn - Vendor Authentication User (tataelxsi)
 * @query {string} authpt - Encrypted vendor authentication key (vofee7ohhecai)
 * @returns {object} Response object containing:
 *   - {string} region - Country
 *   - {string} session_stringvalue - HKS Value
 *   - {string} session_parametername - HKS
 *   - {string} date - Date of the region
 *   - {string} time - Time of the region
 *   - {string} timezone - Timezone of the region
 *   - {string} utc - UTC value
 */
router.get('/startheaderinfo', (req, res) => userController.getStartHeaderInfo(req, res));

export default router;
