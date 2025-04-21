import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { StartHeaderInfoRequest } from '../interfaces/user.interfaces';

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    /**
     * Handle GET request for user start header info
     * @param {Request} req - Express Request object containing query parameters:
     *   - {string} authpn - Vendor Authentication User (tataelxsi)
     *   - {string} authpt - Encrypted vendor authentication key (vofee7ohhecai)
     * @param {Response} res - Express Response object
     * @returns {Promise<void>} Sends JSON response with:
     *   - {string} region - Country
     *   - {string} session_stringvalue - HKS Value
     *   - {string} session_parametername - HKS
     *   - {string} date - Date of the region
     *   - {string} time - Time of the region
     *   - {string} timezone - Timezone of the region
     *   - {string} utc - UTC value
     * @throws {Error} When authentication parameters are missing or invalid
     */
    public async getStartHeaderInfo(req: Request, res: Response): Promise<void> {
        try {
            // Extract and validate required query parameters
            const { authpn, authpt } = req.query;

            if (!authpn || !authpt) {
                res.status(400).json({
                    error: 'Missing required parameters: authpn and authpt are required'
                });
                return;
            }

            // Validate specific values for authentication parameters
            if (authpn !== 'tataelxsi' || authpt !== 'vofee7ohhecai') {
                res.status(401).json({
                    error: 'Invalid authentication credentials'
                });
                return;
            }

            const request: StartHeaderInfoRequest = {
                authpn: authpn as string,
                authpt: authpt as string
            };

            // Process request through service
            const response = await this.userService.getStartHeaderInfo(request);

            // Send successful response
            res.status(200).json(response);
        } catch (error) {
            // Handle errors
            res.status(500).json({
                error: error instanceof Error ? error.message : 'Internal server error'
            });
        }
    }
}
