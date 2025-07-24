import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import response from '../utils/ApiResponse.js';

export const registerUser = async (req, res) => {
    // Extract user data from request body
    // Validate all the fields
    // Check for existing user
    // Create user
    // Check if User is created successfully
    // Return response

    const { username, email, password } = req.body;

    if ([username, email, password].some((field) => !field || (typeof field !== string) || (field?.trim() === "")))
        return response(res, 400, { message: "All fields are required and must be strings!" });

    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existingUser)
        return response(res, 409, "User with the given username or email already exists");

    let createdUser;

    try {
        const user = await User.create({
            username: username.toLowerCase(),
            email: email,
            passord: password
        })
    
        createdUser = await User.findById(user._id).select("-password -refreshToken");
    } catch (error) {
        return response(res, 500, { message: "Error creating user", error: error.message });
    }

    if (!createdUser)
        return response(res, 500, { message: "Error creating user" });

    return response(
        res,
        201,
        {
            message: "User created successfully",
            user: createdUser
        }
    );
}
