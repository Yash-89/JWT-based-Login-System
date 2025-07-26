import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import response from '../utils/ApiResponse.js';

const generateTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
    
        const accessToken = user.createAccessToken();
        const refreshToken = user.createRefreshToken();
    
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
    
        return { accessToken, refreshToken };
    
    } catch (error) {
        return response(res, 500, { error })
    }
}

export const registerUser = async (req, res) => {
    // Extract user data from request body
    // Validate all the fields
    // Check for existing user
    // Create user
    // Check if User is created successfully
    // Return response

    const cleanInput = value => typeof value === "string" ? value.trim() : "";
    const username = cleanInput(req.body.username).toLowerCase();
    const email = cleanInput(req.body.email).toLowerCase();
    const password = cleanInput(req.body.password);

    if ([username, email, password].some((field) => field == ""))
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
            password: password
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

export const loginUser = async (req, res) => {
    // Get login details
    // Validate the fields
    // Find the user
    // Check password
    // Create Refresh and Access Tokens
    // Send cookies

    const cleanInput = value => typeof value === "string" ? value.trim() : "";
    const usernameOrEmail = cleanInput(req.body.usernameOrEmail).toLowerCase();
    const password = cleanInput(req.body.password);

    if ([ usernameOrEmail, password ].some(field => field == ""))
        return response(res, 400, { message: "All fields are required and must be strings!" });

    const user = await User.findOne({
        $or: [ { username: usernameOrEmail }, { email: usernameOrEmail } ]
    });

    if (!user)
        return response(res, 404, { message: "User doesn't exist" });

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid)
        return response(res, 409, { message: "Incorrect Password" });

    const { accessToken, refreshToken } = await generateTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        {
            message: "User logged in successfully!",
            user: loggedInUser, accessToken, refreshToken
        }
    );
};
