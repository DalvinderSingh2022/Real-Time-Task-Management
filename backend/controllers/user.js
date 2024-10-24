const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require("dotenv").config();
const User = require('../models/user.model');
const Task = require('../models/task.model');
const validationHandler = require('../middleware/validationHandler');
const mongoose = require('mongoose');
const Comment = require('../models/comment.model');

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

        res.status(200).json({ message: 'User Registered successfully', user });
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
        const user = await User.findOne({ email })
            .populate([
                { path: 'followers', select: '_id name followers' },
                { path: 'following', select: '_id name followers' }
            ]);

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
        if (!mongoose.Types.ObjectId.isValid(validUser.id)) {
            return res.status(404).json({ message: "User Not found, incorrect Token" });
        }

        const user = await User.findById(validUser.id);
        if (!user) {
            return res.status(404).json({ message: "User Not found, Refresh Page" });
        }

        await user.populate([
            { path: 'followers', select: '_id name followers' },
            { path: 'following', select: '_id name followers' }
        ]);

        return res.status(200).json({ message: "Current user data fetched successfully", user });

    } catch (error) {
        return res.status(401).json({ message: 'User is not authorized or token expired' });
    }
}

// Delete a user
const removeUser = async (req, res) => {
    try {
        // Delete the user by given _id 
        const userId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(404).json({ message: "User Not found, incorrect Id" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User  not found" });
        }

        // Delete tasks assigned by the user
        // also Delete all comments of that task
        const tasksAssignedByUser = await Task.find({ assignedBy: user._id });
        await Promise.all(tasksAssignedByUser.map(async (task) => {
            await Task.findByIdAndDelete(task._id);
            await Comment.deleteMany({ task: task._id });
        }));

        // Reassign tasks assigned to the user
        const tasksAssignedToUser = await Task.find({ assignedTo: user._id });
        await Promise.all(tasksAssignedToUser.map(async (task) => {
            task.assignedTo = task.assignedBy;
            await task.save();
        }));

        // Remove the user from all followers
        await User.updateMany({ followers: user._id }, { $pull: { followers: user._id } });

        // Remove the user from all following
        await User.updateMany({ following: user._id }, { $pull: { following: user._id } });

        // Delete user
        await User.deleteOne({ _id: userId });

        return res.status(201).json({ message: "Account deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


// Get all users
const allUsers = async (req, res) => {
    try {
        // Find all users
        // and Populate the followers and following fields with the corresponding users data
        const users = await User.find()
            .sort({ updatedAt: 'desc' })
            .populate([
                { path: 'followers', select: '_id name followers' },
                { path: 'following', select: '_id name followers' }
            ]);

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

    let isValidId = mongoose.Types.ObjectId.isValid(userId);
    if (isValidId) {
        isValidId = mongoose.Types.ObjectId.isValid(authUserId);
    }
    if (!isValidId) {
        return res.status(404).json({ message: "User Not found, incorrect userId" });
    }

    try {
        // Find the user to follow by given _id
        const userToFollow = await User.findById(userId)
            .populate([
                { path: 'followers', select: '_id name followers' },
                { path: 'following', select: '_id name followers' }
            ]);

        if (!userToFollow) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the authenticated user by given _id
        const authUser = await User.findById(authUserId)
            .populate([
                { path: 'followers', select: '_id name followers' },
                { path: 'following', select: '_id name followers' }
            ]);

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

    let isValidId = mongoose.Types.ObjectId.isValid(userId);
    if (isValidId) {
        isValidId = mongoose.Types.ObjectId.isValid(authUserId);
    }
    if (!isValidId) {
        return res.status(404).json({ message: "User Not found, incorrect userId" });
    }

    try {
        // Find the user to unfollow by given _id
        const userToUnfollow = await User.findById(userId)
            .populate([
                { path: 'followers', select: '_id name followers' },
                { path: 'following', select: '_id name followers' }
            ]);

        if (!userToUnfollow) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the authenticated user by given _id
        const authUser = await User.findById(authUserId)
            .populate([
                { path: 'followers', select: '_id name followers' },
                { path: 'following', select: '_id name followers' }
            ]);

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