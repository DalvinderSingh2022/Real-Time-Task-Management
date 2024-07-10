const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require("dotenv").config();
const User = require('../models/user.model');
const validationHandler = require('../middleware/validationHandler');

// Register a new user
const register = async (req, res) => {
    const { name, email, password } = req.body;

    // Hash the given password using bcrypt
    if (password) {
        var hashedPassword = await bcrypt.hash(password, 10);
    }
    const user = new User({ name, email, password: hashedPassword });

    try {
        // Save the user to the database
        // Generate a JSON Web Token (JWT) for the user
        await user.save();
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "1h" });
        res.status(200).json({ message: 'User created successfully', user, token });
    } catch (err) {
        validationHandler(err, res);
    }
};

// Login an existing user
const login = async (req, res) => {
    const { email, password } = req.body;

    // Return an error response if either email or password is not provided
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Find the user by email
        // and Populate the followers and following fields with the corresponding users data
        const user = await User.findOne({ email }).populate(['followers', 'following']);
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Compare the provided password with the stored password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Generate a JWT for the user
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "1h" });

        return res.status(200).json({ message: 'Logged in successfully', user, token });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get the current user
const currentUser = async (req, res) => {
    const token = req.headers?.Authorization || req.headers?.authorization;

    // Return an error response if JWT token is missing
    if (!token) {
        return res.status(401).json({ message: "User is not authorized or token is missing" });
    }

    try {
        // Verify the JWT token
        // and Populate the followers and following fields with the corresponding users data
        const validUser = jwt.verify(token, process.env.SECRET_KEY);
        if (!validUser) {
            return res.status(401).json({ message: "User is not authorized" });
        }

        // Find the user by _id (stored in token)
        const user = await User.findById(validUser.id).populate(['followers', 'following']);
        if (!user) {
            return res.status(401).json({ message: 'User is not authorized or token is missing' });
        }

        return res.status(200).json({ message: "Current user data fetched successfully", user });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// Delete a user
const removeUser = async (req, res) => {
    try {
        // Delete the user by given _id 
        await User.deleteOne({ _id: req.params.id });

        return res.status(201).json({ messgae: "Account deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


// Get all users
const allUsers = async (req, res) => {
    try {
        // Find all users
        // and Populate the followers and following fields with the corresponding users data
        const users = await User.find().populate(['followers', 'following']);

        res.status(200).json({ message: "All users Data fteched succesfully", users });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// Follow another user
const followUser = async (req, res) => {
    const userId = req.params.userId;
    const authUserId = req.body.userId;

    // Check if the user is trying to follow themselves
    if (userId === authUserId) {
        return res.status(400).json({ message: "You can't follow/unfollow yourself" });
    }

    try {
        // Find the user to follow by given _id
        const userToFollow = await User.findById(userId).populate(['followers', 'following']);;
        if (!userToFollow) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the authenticated user by given _id
        const authUser = await User.findById(authUserId).populate(['followers', 'following']);;
        if (!authUser) {
            return res.status(404).json({ message: 'Auth user not found' });
        }

        // Push the userToFollow to the authUser's following
        authUser.following.push(userToFollow);
        await authUser.save();

        // Push the authenticated user to the userToFollow's followers
        userToFollow.followers.push(authUser);
        await userToFollow.save();

        res.json({ message: 'Followed user successfully', authUser, userToFollow });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


// Unfollow another user
const unfolloweUser = async (req, res) => {
    const userId = req.params.userId;
    const authUserId = req.body.userId;

    // Check if the user is trying to Unfollow themselves
    if (userId === authUserId) {
        return res.status(400).json({ message: "You can't follow/unfollow yourself" });
    }

    try {
        // Find the user to unfollow by given _id
        const userToUnfollow = await User.findById(userId).populate(['followers', 'following']);;
        if (!userToUnfollow) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the authenticated user by given _id
        const authUser = await User.findById(authUserId).populate(['followers', 'following']);;
        if (!authUser) {
            return res.status(404).json({ message: 'Auth user not found' });
        }

        // Remove the userToUnfollow from the  authUser's following
        authUser.following.pull(userId);
        await authUser.save();

        // Remove the  authUser from the userToUnfollow's followers list
        userToUnfollow.followers.pull(authUserId);
        await userToUnfollow.save();

        res.json({ message: 'Unfollowed user successfully', authUser, userToUnfollow });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { register, login, currentUser, removeUser, allUsers, followUser, unfolloweUser };