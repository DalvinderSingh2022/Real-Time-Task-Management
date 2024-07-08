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

    const user = await User.findOne({ email });
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

        const user = await User.findById(validUser.id);
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

module.exports = { register, login, currentUser, removeUser };