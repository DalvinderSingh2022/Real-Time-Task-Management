const express = require("express");
const router = express.Router();
const Comment = require("../models/comment.model");
const mongoose = require("mongoose");
const validationHandler = require("../middleware/validationHandler");

// Get comments for a specific task
const allComments = async (req, res) => {
    try {
        // Find all comments of task with _id equal to taskId
        // and Populate the task and user fields with the corresponding data
        const taskId = new mongoose.Types.ObjectId(req.params.taskId);
        const comments = await Comment.find({ task: taskId }).populate(['task', 'user']).sort({ updatedAt: 'desc' });

        res.status(200).json({ message: 'All Comments fetched successfully', comments });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Create a new comment
const addComment = async (req, res) => {
    const { comment, userId } = req.body;
    const taskId = req.params.taskId;

    // Create a new Comment instance
    const newComment = new Comment({
        comment,
        task: new mongoose.Types.ObjectId(taskId),
        user: new mongoose.Types.ObjectId(userId)
    });

    try {
        // Save the new comment to the database
        // and Populate the task and user fields with the corresponding data
        await newComment.save();
        const Comment = await newComment.populate(['task', 'user']);

        return res.status(201).json({ message: 'Comment added successfully', comment: Comment });
    } catch (error) {
        validationHandler(error, res);
    }
};

module.exports = { allComments, addComment };