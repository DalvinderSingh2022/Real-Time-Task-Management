const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    dueDate: {
        type: Date,
        required: [true, 'Due date is required']
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    completed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;