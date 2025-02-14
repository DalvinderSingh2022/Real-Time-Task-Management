const mongoose = require('mongoose');
const axios = require('axios');
const cron = require('node-cron');
require("dotenv").config();

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
    assignedTo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Assigning User is required']
    },
    status: {
        type: String,
        enum: ["Not Started", "In Progress", "Completed"],
        default: "Not Started"
    }
}, {
    timestamps: true
});

const Task = mongoose.model('Task', taskSchema);

cron.schedule('0 0 * * *', async () => {
    try {
        const today = new Date().setHours(0, 0, 0, 0);
        const overDueTasks = await Task.find({ dueDate: { $lt: today } });
        const groupedTasks = overDueTasks.reduce((acc, task) => {
            task.assignedTo.forEach(user => {
                if (!acc[user])
                    acc[user] = [task];
                else
                    acc[user].push(task);
            });
            return acc;
        }, {});

        Object.entries(groupedTasks).forEach(async ([user, tasks]) => {
            await axios.post(process.env.API_BASE_URL + 'notifications/due-date-reminder', { user, tasks });
        });
    } catch (error) {
        console.error(error);
    }
});

module.exports = Task;