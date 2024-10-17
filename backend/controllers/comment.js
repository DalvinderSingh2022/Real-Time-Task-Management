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
        const taskId = req.params.taskId;

        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(404).json({ message: "Comments Not found, incorrect taskId" });
        }

        const comments = await Comment.find({ task: taskId })
            .sort({ updatedAt: 'asc' })
            .populate({
                path: 'user',
                select: '_id name'
            });

        res.status(200).json({ message: 'All Comments fetched successfully', comments });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Create a new comment
const addComment = async (req, res) => {
    const { comment, userId } = req.body;
    const taskId = req.params.taskId;

    let isValidId = mongoose.Types.ObjectId.isValid(userId);
    if (isValidId) {
        isValidId = mongoose.Types.ObjectId.isValid(taskId);
    }
    if (!isValidId) {
        return res.status(404).json({ message: "Comments Not found, incorrect Id" });
    }

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
        const Comment = await newComment.populate({
            path: 'user',
            select: '_id name'
        });

        return res.status(201).json({ message: 'Comment added successfully', comment: Comment });
    } catch (error) {
        validationHandler(error, res);
    }
};

module.exports = { allComments, addComment };