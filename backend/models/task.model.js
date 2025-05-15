const mongoose = require('mongoose');
const axios = require('axios');
const cron = require('node-cron');
require("dotenv").config();

const DueStatus = {
    TODAY: 'Due Today',
    TOMORROW: 'Due Tomorrow',
    YESTERDAY: 'Due Yesterday',
    THIS_WEEK: 'Due This Week',
    LAST_WEEK: 'Due Last Week',
    THIS_MONTH: 'Due This Month',
    OVERDUE: 'Over due'
};

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
    },
    dueStatus: {
        type: String,
        enum: Object.values(DueStatus),
        default: DueStatus.OVERDUE
    }
}, {
    timestamps: true
});

const Task = mongoose.model('Task', taskSchema);

const getdueStatus = async (tasks) => {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const startOfLastWeek = new Date(startOfWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const dueToday = [];

    try {
        for (const task of tasks) {
            if (task.dueDate >= startOfToday && task.dueDate < startOfTomorrow) {
                task.dueStatus = DueStatus.TODAY;
            } else if (task.dueDate >= startOfTomorrow && task.dueDate < new Date(startOfTomorrow).setDate(startOfTomorrow.getDate() + 1)) {
                task.dueStatus = DueStatus.TOMORROW;
            } else if (task.dueDate >= startOfYesterday && task.dueDate < startOfToday) {
                task.dueStatus = DueStatus.YESTERDAY;
            } else if (task.dueDate >= startOfWeek && task.dueDate < new Date(startOfWeek).setDate(startOfWeek.getDate() + 7)) {
                task.dueStatus = DueStatus.THIS_WEEK;
            } else if (task.dueDate >= startOfLastWeek && task.dueDate < startOfWeek) {
                task.dueStatus = DueStatus.LAST_WEEK;
            } else if (task.dueDate >= startOfMonth) {
                task.dueStatus = DueStatus.THIS_MONTH;
            } else {
                task.dueStatus = DueStatus.OVERDUE;
            }

            await task.save();

            if (task.dueStatus === DueStatus.TODAY) {
                dueToday.push(task);
            }
        }
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }

    return dueToday;
}

cron.schedule('0 0 * * *', async () => {
    const tasks = await Task.find();
    const dueToday = await getdueStatus(tasks);
    console.log("Cron task: ", new Date().toLocaleString());

    try {
        const groupedTasks = dueToday.reduce((acc, task) => {
            task.assignedTo.forEach(user => {
                (!acc[user]) ? acc[user] = [task] : acc[user].push(task);
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

module.exports = { DueStatus, Task, getdueStatus };