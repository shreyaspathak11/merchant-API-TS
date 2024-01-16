import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';

interface DecodedToken {
    _id: string;
}

// Register
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body;

        // check if user exists
        let user = await User.findOne({ email });
        if (user) {
            res.status(400).json({
                success: false,
                message: 'User already exists'
            });
            return; // Return here to exit the function after sending the response
        }

        user = await User.create({
            name,
            email,
            password
        });

        // create token
        const token = await user.generateToken();

        const options = {
            expires: new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000
            ),
            httpOnly: true
        };

        res.status(200).cookie('token', token, options).json({
            success: true,
            message: 'User created successfully',
            token,
            user,
        });

    } catch (error: any) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Login
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // check if user exists
        const user = await User.findOne({ email })
            .select('+password'); // select password as it is set to false in the model by default
        if (!user) {
            res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
            return; // Return here to exit the function after sending the response
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            res.status(400).json({
                success: false,
                message: 'Invalid password'
            });
            return
        }

        // create token
        const token = await user.generateToken();

        const options = {
            expires: new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000
            ),
            httpOnly: true
        };

        res.status(200).cookie('token', token, options).json({
            success: true,
            message: 'User logged in successfully',
            token,
            user,
        });

    } catch (error: any) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Logout
export const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        res
            .status(200)
            .clearCookie('token')
            .cookie('token', 'none', {
                expires: new Date(Date.now() + 10 * 1000),
                httpOnly: true
            })
            .json({
                success: true,
                message: 'User logged out successfully'
            });
    }
    catch (error: any) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Session
export const getSession = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token } = req.cookies;

        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized: No token provided'
            });
            return;
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as DecodedToken;

            const user = await User.findById(decoded._id);

            if (!user) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized: Invalid token'
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Session is valid',
                user,
            });
        } catch (error: any) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized: Invalid token'
            });
            return;
        }
    } catch (error: any) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
        return;
    }
};
           