const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const { Task } = require("../models/task.model");
const Comment = require("../models/comment.model");
const { Notification } = require("../models/notification.model");
const { sendMail } = require("../config/MailService");
const {
  registrationTemplate,
  onFollowTemplate,
  onUnfollowTemplate,
} = require("../emailTemplates");
require("dotenv").config();

//helper function to generate avatar
const getAvatar = (name) => {
  const baseUrl =
    "https://api.dicebear.com/9.x/fun-emoji/svg?radius=50&scale=75";
  const mouthOptions = [
    "plain",
    "lilSmile",
    "sad",
    "shy",
    "cute",
    "wideSmile",
    "shout",
    "smileTeeth",
    "smileLol",
    "pissed",
    "drip",
    "tongueOut",
    "kissHeart",
    "sick",
    "faceMask",
  ];
  const eyesOptions = [
    "sad",
    "tearDrop",
    "pissed",
    "cute",
    "wink",
    "wink2",
    "plain",
    "glasses",
    "closed",
    "love",
    "stars",
    "shades",
    "closed2",
    "crying",
    "sleepClose",
  ];
  const backgroundColorOptions = [
    "A2D9FF",
    "0099FF",
    "00CBA9",
    "FD81CB",
    "FC9561",
    "FFE55A",
    "E3E3E3",
    "FF4848",
  ];

  const url = {
    seed: name.replace(" ", "%20"),
    mouth: mouthOptions[Math.floor(Math.random() * mouthOptions.length)],
    eyes: eyesOptions[Math.floor(Math.random() * eyesOptions.length)],
    backgroundColor:
      backgroundColorOptions[
        Math.floor(Math.random() * backgroundColorOptions.length)
      ],
  };

  return (
    baseUrl +
    Object.entries(url).reduce(
      (acc, [option, value]) => acc + `&${option}=${value}`,
      ""
    )
  );
};

const magicLogin = async (req, res) => {
  try {
    const { key } = req.body;
    const decoded = jwt.verify(key, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "Invalid or expired link" });
    }

    await user.populate([
      { path: "followers", select: "_id name avatar followers" },
      { path: "following", select: "_id name avatar followers" },
    ]);

    // Removing password so it doesn't reflect in frontend
    user.password = null;

    // Generate a JWT for the user
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    return res
      .status(200)
      .json({ message: "Logged in successfully", user, token });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired link" });
  }
};

// Register a new user
const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Input validation
  if (!email?.trim() || !password?.trim() || !name?.trim()) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const avatar = getAvatar(name.trim());

    // Create new user with sanitized input
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      avatar,
      password: hashedPassword,
    });

    // Save the user to the database
    await user.save();

    await sendMail({
      to: user.email,
      subject: "🎉 Welcome to Task Manager",
      html: registrationTemplate(user._id, user.name),
    });

    res.status(200).json({ message: "User Registered successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
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
    const user = await User.findOne({ email }).populate([
      { path: "followers", select: "_id name avatar followers" },
      { path: "following", select: "_id name avatar followers" },
    ]);

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Compare the provided password with the stored password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Removing password so it doesn't reflect in frontend
    user.password = null;

    // Generate a JWT for the user
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    return res
      .status(200)
      .json({ message: "Logged in successfully", user, token });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
};

// Get the current user
const currentUser = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User Not found, Refresh Page" });
    }

    await user.populate([
      { path: "followers", select: "_id name avatar followers" },
      { path: "following", select: "_id name avatar followers" },
    ]);

    return res
      .status(200)
      .json({ message: "Current user data fetched successfully", user });
  } catch (error) {
    return res
      .status(401)
      .json({ message: "User is not authorized or token expired" });
  }
};

// Delete a user
const removeUser = async (req, res) => {
  const userId = req.userId;

  if (!userId) {
    return res
      .status(400)
      .json({ message: "Missing requirements to process request" });
  }

  try {
    // Delete the user by given _id
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User  not found" });
    }

    // Delete tasks assigned by the user
    // also Delete all comments of that task
    const tasksAssignedByUser = await Task.find({ assignedBy: user._id });
    await Promise.all(
      tasksAssignedByUser.map(async (task) => {
        await Task.findByIdAndDelete(task._id);
        await Comment.deleteMany({ task: task._id });
      })
    );

    // Reassign tasks assigned to the user
    const tasksAssignedToUser = await Task.find({
      assignedTo: { $in: [user._id] },
    });
    await Promise.all(
      tasksAssignedToUser.map(async (task) => {
        task.assignedTo = task.assignedTo.filter(
          (id) => id.toString() !== user._id.toString()
        );
        if (task.assignedTo.length === 0) {
          task.assignedTo.push(task.assignedBy);
        }
        await task.save();
      })
    );

    // Remove the user from all followers
    await User.updateMany(
      { followers: user._id },
      { $pull: { followers: user._id } }
    );

    // Remove the user from all following
    await User.updateMany(
      { following: user._id },
      { $pull: { following: user._id } }
    );

    // Delete all notifications of user
    await Notification.deleteMany({ user: user._id });

    // Delete user
    await User.findByIdAndDelete({ _id: userId });

    return res.status(201).json({ message: "Account deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
};

// Get all users
const allUsers = async (req, res) => {
  try {
    // Find all users
    // and Populate the followers and following fields with the corresponding users data
    const users = await User.find()
      .select("-password")
      .sort({ updatedAt: "desc" })
      .populate([
        { path: "followers", select: "_id name avatar followers" },
        { path: "following", select: "_id name avatar followers" },
      ]);

    res
      .status(200)
      .json({ message: "All users Data fteched succesfully", users });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
};

// Update a User
const updateUser = async (req, res) => {
  const userId = req.userId;
  const user = req.body;

  if (!userId || !user) {
    return res
      .status(400)
      .json({ message: "Missing requirements to process request" });
  }

  try {
    // Update the User with the new data
    // and Populate the followers and following fields with the corresponding users data
    const updatedUser = await User.findByIdAndUpdate(userId, user, {
      new: true,
      runValidators: true,
    })
      .select("-password")
      .populate([
        { path: "followers", select: "_id name avatar followers" },
        { path: "following", select: "_id name avatar followers" },
      ]);

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate the updated user document
    await updatedUser.validate();

    return res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
};

// Follow another user
const followUser = async (req, res) => {
  const userId = req.params.userId;
  const authUserId = req.userId;

  if (!userId || !authUserId) {
    return res
      .status(400)
      .json({ message: "Missing requirements to process request" });
  }

  // Check if the user is trying to follow themselves
  if (userId === authUserId) {
    return res
      .status(400)
      .json({ message: "You can't follow/unfollow yourself" });
  }

  try {
    // Find the user to follow by given _id
    const userToFollow = await User.findById(userId)
      .select("-password")
      .populate([
        { path: "followers", select: "_id name avatar followers" },
        { path: "following", select: "_id name avatar followers" },
      ]);

    if (!userToFollow) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the authenticated user by given _id
    const authUser = await User.findById(authUserId)
      .select("-password")
      .populate([
        { path: "followers", select: "_id name avatar followers" },
        { path: "following", select: "_id name avatar followers" },
      ]);

    if (!authUser) {
      return res.status(404).json({ message: "Auth user not found" });
    }

    // Push the userToFollow to the authUser's following
    authUser.following.push(userToFollow);
    await authUser.save();

    // Push the authenticated user to the userToFollow's followers
    userToFollow.followers.push(authUser);
    await userToFollow.save();

    await sendMail({
      to: userToFollow.email,
      subject: "👋 You Have a New Follower!",
      html: onFollowTemplate(authUser._id, userToFollow.name, authUser.name),
    });

    res.json({ message: "Followed user successfully", authUser, userToFollow });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
};

// Unfollow another user
const unfolloweUser = async (req, res) => {
  const userId = req.params.userId;
  const authUserId = req.userId;

  if (!userId || !authUserId) {
    return res
      .status(400)
      .json({ message: "Missing requirements to process request" });
  }

  // Check if the user is trying to Unfollow themselves
  if (userId === authUserId) {
    return res
      .status(400)
      .json({ message: "You can't follow/unfollow yourself" });
  }

  try {
    // Find the user to unfollow by given _id
    const userToUnfollow = await User.findById(userId)
      .select("-password")
      .populate([
        { path: "followers", select: "_id name avatar followers" },
        { path: "following", select: "_id name avatar followers" },
      ]);

    if (!userToUnfollow) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the authenticated user by given _id
    const authUser = await User.findById(authUserId)
      .select("-password")
      .populate([
        { path: "followers", select: "_id name avatar followers" },
        { path: "following", select: "_id name avatar followers" },
      ]);

    if (!authUser) {
      return res.status(404).json({ message: "Auth user not found" });
    }

    // Remove the userToUnfollow from the  authUser's following
    authUser.following.pull(userId);
    await authUser.save();

    // Remove the  authUser from the userToUnfollow's followers list
    userToUnfollow.followers.pull(authUserId);
    await userToUnfollow.save();

    await sendMail({
      to: userToUnfollow.email,
      subject: "👋 Someone Unfollowed You",
      html: onUnfollowTemplate(
        userToUnfollow._id,
        userToUnfollow.name,
        authUser.name
      ),
    });

    res.json({
      message: "Unfollowed user successfully",
      authUser,
      userToUnfollow,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
};

module.exports = {
  register,
  login,
  magicLogin,
  currentUser,
  removeUser,
  allUsers,
  followUser,
  unfolloweUser,
  updateUser,
};
