const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: [true, 'Comment is required'],
        validate: {
            validator: (val) => val.trim().length > 0,
            message: 'Comment cannot be empty'
        }
    },
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: [true, 'Task reference is required']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User reference is required']
    }
}, {
    timestamps: true
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;