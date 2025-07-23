import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import response from '../utils/ApiResponse.js';

export const registerUser = async (req, res) => {
    // Extract user data from request body
    // Validate all the fields
    // Check for existing user
    // Create user

    const { username, email, password } = req.body;

    if ([username, email, password].some((field) => field?.trim() === ""))
        return response(res, 400, { message: "All fields required!" });
}
