const express = require("express");
const { allComments, addComment } = require("../controllers/comment");

const router = express.Router();

router.route("/:taskId").post(addComment).get(allComments);

module.exports = router;
