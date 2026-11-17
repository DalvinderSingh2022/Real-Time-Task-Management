const { Task, getdueStatus } = require("../models/task.model");
const Comment = require("../models/comment.model");
const User = require("../models/user.model");
const {
  taskCreatedTemplate,
  taskDeletedTemplate,
  taskUpdatedTemplate,
} = require("../emailTemplates");
const { sendMail } = require("../config/MailService");

// Create a new task
const addTask = async (req, res) => {
  const { title, description, dueDate, assignedTo } = req.body;
  const assignedBy = req.userId;

  // Return an error response if either title, description, dueDate, or assignedTo is not provided
  if (!title || !description || !dueDate || !assignedTo) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findById(assignedBy);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const users = await User.find({
      _id: { $in: assignedTo },
      orgId: user.orgId,
      isApproved: true,
    });

    if (users.length !== assignedTo.length) {
      return res.status(400).json({ message: "Invalid assigned users" });
    }

    // Create a new Task instance
    const newTask = new Task({
      title,
      description,
      dueDate,
      assignedTo,
      assignedBy,
      orgId: user.orgId,
    });

    // Save the new task to the database
    // and Populate the assignedBy and assignedTo fields with the corresponding user data
    await getdueStatus([newTask]);
    const task = await newTask.populate([
      { path: "assignedTo", select: "_id name avatar email" },
      { path: "assignedBy", select: "_id name avatar" },
    ]);

    const assignedUsers = Array.isArray(task.assignedTo)
      ? task.assignedTo
      : [task.assignedTo];

    await Promise.all(
      assignedUsers.map((assignedUser) =>
        sendMail({
          to: assignedUser.email,
          subject: "🆕 New Task Assigned",
          html: taskCreatedTemplate(
            assignedUser._id,
            assignedUser.name,
            task.assignedBy.name,
            title,
            task._id,
            dueDate,
          ),
        }),
      ),
    );

    return res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

// Retrieve all tasks for a user
const allTasks = async (req, res) => {
  const userId = req.userId;

  if (!userId) {
    return res
      .status(400)
      .json({ message: "Missing requirements to process request" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let query;
    if (user.role === "admin") {
      // Admins see all tasks in their org
      query = { orgId: user.orgId };
    } else {
      // Users see tasks assigned to them or assigned by them
      query = {
        orgId: user.orgId,
        $or: [{ assignedTo: { $in: [userId] } }, { assignedBy: userId }],
      };
    }

    // Find tasks based on query
    // and Populate the assignedBy and assignedTo fields with the corresponding user data
    let tasks = await Task.find(query)
      .sort({ updatedAt: "desc" })
      .populate([
        { path: "assignedTo", select: "_id name avatar" },
        { path: "assignedBy", select: "_id name avatar" },
      ]);

    const statusOrder = { "In Progress": 1, "Not Started": 2, Completed: 3 };
    tasks = tasks.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);

    res.status(200).json({ message: "All Task fetched successfully", tasks });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
};

// Retrieve a task
const getTask = async (req, res) => {
  const taskId = req.params.id;
  const userId = req.userId;

  if (!taskId) {
    return res
      .status(400)
      .json({ message: "Missing requirements to process request" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Retrieve the task with the given _id
    // and Populate the assignedBy and assignedTo fields with the corresponding user data
    const task = await Task.findOne({
      _id: taskId,
      orgId: user.orgId,
    }).populate([
      { path: "assignedTo", select: "_id name avatar" },
      { path: "assignedBy", select: "_id name avatar" },
    ]);

    if (!task) {
      return res.status(404).json({ message: "Task Not found" });
    }

    res.status(200).json({ message: "Task fetched successfully", task });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
};

// Delete a task
const removeTask = async (req, res) => {
  const taskId = req.params.id;
  const userId = req.userId;

  if (!taskId) {
    return res
      .status(400)
      .json({ message: "Missing requirements to process request" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const task = await Task.findOne({
      _id: taskId,
      orgId: user.orgId,
    })
      .populate("assignedTo", "name email")
      .populate("assignedBy", "name");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check permissions (assignedBy / assignedTo are populated documents here,
    // so compare their _id values rather than the document itself)
    const canDelete =
      user.role === "admin" ||
      task.assignedBy._id.toString() === userId ||
      task.assignedTo.some((u) => u._id.toString() === userId);

    if (!canDelete) {
      return res
        .status(403)
        .json({ message: "You don't have permission to delete this task" });
    }

    // Delete the task with the given _id
    const [deletedTask] = await Promise.all([
      Task.findByIdAndDelete(taskId),
      Comment.deleteMany({ task: taskId }),
    ]);

    // Check if the task was found and deleted
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    const assignedUsers = Array.isArray(task.assignedTo)
      ? task.assignedTo
      : [task.assignedTo];

    await Promise.all(
      assignedUsers.map((assignedUser) =>
        sendMail({
          to: assignedUser.email,
          subject: "❌ Task Deleted",
          html: taskDeletedTemplate(
            assignedUser._id,
            assignedUser.name,
            task.assignedBy.name,
            task.title,
          ),
        }),
      ),
    );

    return res.status(201).json({ message: "Task deleted Successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
};

// Update a task
const updateTask = async (req, res) => {
  const taskId = req.params.id;
  const task = req.body;
  const userId = req.userId;

  if (!taskId || !task) {
    return res
      .status(400)
      .json({ message: "Missing requirements to process request" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingTask = await Task.findOne({
      _id: taskId,
      orgId: user.orgId,
    });
    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check permissions
    const canEdit =
      user.role === "admin" ||
      existingTask.assignedBy.toString() === userId ||
      existingTask.assignedTo.some((id) => id.toString() === userId);

    if (!canEdit) {
      return res
        .status(403)
        .json({ message: "You don't have permission to edit this task" });
    }

    // Whitelist the fields a client is allowed to change (prevents mass
    // assignment of orgId / assignedBy / dueStatus / _id, etc.)
    const allowedFields = [
      "title",
      "description",
      "dueDate",
      "status",
      "assignedTo",
    ];
    const updateData = {};
    for (const field of allowedFields) {
      if (field in task) updateData[field] = task[field];
    }
    // assignedTo may arrive as populated user objects; normalize to ids
    if (Array.isArray(updateData.assignedTo)) {
      updateData.assignedTo = updateData.assignedTo.map((u) =>
        u && u._id ? u._id : u,
      );
    }

    // Update the task with the new data
    // and Populate the assignedBy and assignedTo fields with the corresponding user data
    const updatedTask = await Task.findByIdAndUpdate(taskId, updateData, {
      new: true,
      runValidators: true,
    }).populate([
      { path: "assignedTo", select: "_id name avatar email" },
      { path: "assignedBy", select: "_id name avatar email" },
    ]);

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Notify every assignee plus the task creator, without double-mailing
    // anyone who happens to be both.
    const assignedUsers = Array.isArray(updatedTask.assignedTo)
      ? updatedTask.assignedTo
      : [updatedTask.assignedTo];

    const recipients = [...assignedUsers];
    if (
      updatedTask.assignedBy &&
      !assignedUsers.some(
        (u) => u._id.toString() === updatedTask.assignedBy._id.toString(),
      )
    ) {
      recipients.push(updatedTask.assignedBy);
    }

    await Promise.all(
      recipients.map((recipient) =>
        sendMail({
          to: recipient.email,
          subject: "🔄 Task Updated",
          html: taskUpdatedTemplate(
            recipient._id,
            recipient.name,
            updatedTask.assignedBy.name,
            updatedTask.title,
            updatedTask._id,
            updatedTask.status,
            updatedTask.dueDate,
            updatedTask.description,
          ),
        }),
      ),
    );

    return res
      .status(200)
      .json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
};

module.exports = { allTasks, addTask, getTask, removeTask, updateTask };
