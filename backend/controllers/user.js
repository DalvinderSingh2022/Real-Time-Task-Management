const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require("dotenv").config();
const User = require('../models/user.model');
const validationHandler = require('../middleware/validationHandler');

const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (password) {
        var hashedPassword = await bcrypt.hash(password, 10);
    }
    const user = new User({ name, email, password: hashedPassword });

    try {
        await user.save();
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "1h" });
        res.json({ message: 'User created successfully', user, token });
    } catch (err) {
        validationHandler(err, res);
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email }).populate(['followers', 'following']);
    if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "1h" });

    return res.status(200).json({ message: 'Logged in successfully', user, token });
};

const currentUser = async (req, res) => {
    const token = req.headers?.Authorization || req.headers?.authorization;

    if (!token) {
        return res.status(401).json({ message: "User is not authorized or token is missing" });
    }

    try {
        const validUser = jwt.verify(token, process.env.SECRET_KEY);
        if (!validUser) {
            return res.status(401).json({ message: "User is not authorized" });
        }

        const user = await User.findById(validUser.id).populate(['followers', 'following']);
        if (!user) {
            return res.status(401).json({ message: 'User is not authorized or token is missing' });
        }

        return res.status(200).json(user);

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const removeUser = async (req, res) => {
    try {
        console.log(req.params);
        await User.deleteOne({ _id: req.params.id });

        return res.status(201).json({ messgae: "Account deleted Succesfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const allUsers = async (req, res) => {
    try {
        const users = await User.find().populate(['followers', 'following']);

        res.status(200).json(users);
    } catch (error) {
        return res.status(500).json(error);
    }
}

const followUser = async (req, res) => {
    const userId = req.params.userId;
    const authUserId = req.body.userId;

    if (userId === authUserId) {
        return res.status(400).send({ message: 'you Can`t follow yourself' });
    }

    try {
        const userToFollow = await User.findById(userId).populate(['followers', 'following']);;
        if (!userToFollow) {
            return res.status(404).send({ message: 'User not found' });
        }

        const authUser = await User.findById(authUserId).populate(['followers', 'following']);;
        if (!authUser) {
            return res.status(404).send({ message: 'Auth user not found' });
        }

        if (authUser.following.includes(userId)) {
            return res.status(400).send({ message: 'Already following this user' });
        }

        authUser.following.push(userToFollow);
        await authUser.save();

        userToFollow.followers.push(authUser);
        await userToFollow.save();

        res.json({ message: 'Followed user successfully', data: { authUser, userToFollow } });
    } catch (err) {
        res.status(500).send({ message: "Error following user" });
    }
};

const unfolloweUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const authUserId = req.body.userId;

        const userToUnfollow = await User.findById(userId).populate(['followers', 'following']);;
        if (!userToUnfollow) {
            return res.status(404).json({ message: 'User not found' });
        }

        const authUser = await User.findById(authUserId).populate(['followers', 'following']);;
        if (!authUser) {
            return res.status(404).send({ message: 'Auth user not found' });
        }

        authUser.following.pull(userId);
        await authUser.save();

        userToUnfollow.followers.pull(authUserId);
        await userToUnfollow.save();

        res.json({ message: 'Unfollowed user successfully', data: { authUser, userToUnfollow } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error unfollowing user' });
    }
};

module.exports = { register, login, currentUser, removeUser, allUsers, followUser, unfolloweUser };