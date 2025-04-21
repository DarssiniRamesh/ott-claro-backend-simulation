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
     * @param req Express Request object
     * @param res Express Response object
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
